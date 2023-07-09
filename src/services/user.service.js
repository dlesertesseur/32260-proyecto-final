import config from "../config/config.js";
import CartRepository from "../repositories/cart.repository.js";
import UserRepository from "../repositories/user.repository.js";
import { filterRecordsByLastConnection } from "../util/Date.js";
import sendMail from "./mail.service.js";

const repository = new UserRepository();

const getAllUsers = async () => {
  const users = await repository.getAll();

  const list = users.map((u) => {
    const user = {
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
    };
    return user;
  });

  return list;
};

const findByEmail = async (email) => {
  const user = await repository.findByEmail(email);
  return user;
};

const findUserById = async (id) => {
  const user = await repository.findById(id);
  return user;
};

const updateUser = async (uid, user) => {
  await repository.update(uid, user);
};

const insertUser = async (uid, user) => {
  await repository.insert(uid, user);
};

const deleteUser = async (uid) => {
  await repository.remove(uid);
};

const addCartToUser = async (uid) => {
  const user = await repository.addCartToUser(uid);
  return user;
};

const getUnloadDocs = (user) => {
  const unloadDocs = [];
  if (user.documents) {
    config.DOC_NAMES.forEach((doc) => {
      const exists = user.documents.some(
        (existingDoc) => existingDoc.name.toUpperCase() === doc
      );
      if (!exists) {
        unloadDocs.push(doc);
      }
    });
  }
  return unloadDocs;
};

const changeUserRole = async (id) => {
  const user = await repository.findById(id);
  if (user) {
    if (user.role === config.USER_ROLE) {
      const unloadDocs = getUnloadDocs(user);
      if (unloadDocs.length > 0) {
        throw {
          status: "error",
          message: "User does not have all documents uploaded",
        };
      }
    }

    await repository.changeUserRole(
      user.id,
      user.role === config.USER_ROLE ? config.PREMIUM_ROLE : config.USER_ROLE
    );
  } else {
    throw new Error(`email ${email} not found`);
  }
};

const generateDocumentURL = (file, userName) => {
  const baseUrl = `${userName}/`;
  const fileName = file.filename;
  const documentURL = baseUrl + fileName;
  return documentURL;
};

const updateUserDocuments = async (uid, documentStatus) => {
  const userRepository = new UserRepository();

  const invalidDocuments = documentStatus.filter(
    (doc) => !config.DOC_NAMES.includes(doc.name.toUpperCase())
  );
  if (invalidDocuments.length > 0) {
    const errorText = "Invalid document name/s";
    throw new Error(
      `${errorText}: ${invalidDocuments.map((doc) => doc.name).join(", ")}`
    );
  }
  const result = await userRepository.updateDocumentsStatus(
    uid,
    documentStatus
  );
  return result;
};

const updateUserProfileImage = async (uid, documentStatus) => {
  const userRepository = new UserRepository();
  const result = await userRepository.updateDocumentsStatus(
    uid,
    documentStatus
  );
  return result;
};

const updateUserProductPhoto = async (uid, documentStatus) => {
  const userRepository = new UserRepository();
  const result = await userRepository.updateDocumentsStatus(
    uid,
    documentStatus
  );
  return result;
};

const removeUserComplety = async (user) => {
  const userRepository = new UserRepository();
  const cartRepository = new CartRepository();
  await userRepository.remove(user.id);

  if (user.cart) {
    await cartRepository.remove(user.cart.id);
  }

  const subject = `Account deleted due to inactivity`;
  const body = `<h2>User: ${user.email} was deleted due to inactivity <h2>`;

  await sendMail(user.email, subject, body);
};

const removeInactiveUser = async () => {
  const minutes = config.MAX_USER_IDLE_TIME;
  const users = await repository.getAll();

  const userToDelete = filterRecordsByLastConnection(users, minutes);

  for (let index = 0; index < userToDelete.length; index++) {
    const user = userToDelete[index];
    if (user.email !== config.ADMIN_EMAIL) {
      await removeUserComplety(user);
    }
  }
};

export {
  getAllUsers,
  findByEmail,
  findUserById,
  updateUser,
  insertUser,
  deleteUser,
  addCartToUser,
  changeUserRole,
  generateDocumentURL,
  updateUserDocuments,
  updateUserProfileImage,
  updateUserProductPhoto,
  removeInactiveUser,
  getUnloadDocs
};
