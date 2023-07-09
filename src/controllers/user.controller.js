import config from "../config/config.js";
import {
  getAllUsers,
  findUserById,
  insertUser,
  updateUser,
  deleteUser,
  addCartToUser,
  changeUserRole,
  generateDocumentURL,
  updateUserDocuments,
  updateUserProfileImage,
  removeInactiveUser,
  findByEmail,
  getUnloadDocs,
} from "../services/user.service.js";
import path from "path";

const getAll = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const findById = async (req, res) => {
  const pid = req.params.pid;
  try {
    const user = await findUserById(pid);
    res.send(user);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const insert = async (req, res) => {
  try {
    const ret = await insertUser(req.body);
    res.send(ret);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const update = async (req, res) => {
  const pid = req.params.pid;

  if (pid) {
    try {
      const user = await updateUser(pid, req.body);
      res.send(user);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  } else {
    res.status(400).send({ message: "Bad request" });
  }
};

const remove = async (req, res) => {
  const uid = req.params.uid;

  if (uid) {
    try {
      await deleteUser(uid);
      res.send({ message: "User deleted successfully" });
    } catch (error) {
      req.logger.error(error);
      res.status(500).send({ message: error.message });
    }
  } else {
    res.status(400).send({ message: "Bad request" });
  }
};

const removeInactive = async (req, res) => {
  try {
    await removeInactiveUser();
    res.send({ message: "inactive users removed successfully" });
  } catch (error) {
    req.logger.error(error);
    res.status(500).send({ message: error.message });
  }
};

const addCart = async (req, res) => {
  const uid = req.params.uid;

  if (uid) {
    try {
      const user = addCartToUser(uid);
      res.send(user);
    } catch (error) {
      req.logger.error(error);
      res.status(500).send({ message: error.message });
    }
  } else {
    res.status(400).send({ message: "Bad request" });
  }
};

const changeRole = async (req, res) => {
  const uid = req.params.uid;

  if (uid) {
    try {
      await changeUserRole(uid);
      res.send({ status: 200 });
    } catch (error) {
      res.send({ status: "error" });
    }
  } else {
    res.status(400).send({ message: "Bad request" });
  }
};

const processDocuments = async (req, res, files) => {
  if (files && files.length > 0) {
    const { uid } = req.params;

    const documentStatus = files.map((file) => ({
      name: path.parse(file.originalname).name,
      reference: generateDocumentURL(file, uid),
    }));
    const resp = await updateUserDocuments(uid, documentStatus);
    res.send({
      status: "success",
      payload: `Documentos cargados correctamente`,
      duplicated: resp.duplicateDocuments,
    });
  } else {
    res.status(400).send({
      status: "error",
      payload: "No se proporcionaron documentos",
    });
  }
};

const processProfileImage = async (req, res, files) => {
  if (files && files.length > 0) {
    const { uid } = req.params;

    const documentStatus = files.map((file) => ({
      name: path.parse(file.originalname).name,
      reference: generateDocumentURL(file, uid),
    }));
    const resp = await updateUserProfileImage(uid, documentStatus);
    res.send({
      status: "success",
      payload: `Imagen de perfile cargada correctamente`,
      duplicated: resp.duplicateDocuments,
    });
  } else {
    res.status(400).send({
      status: "error",
      payload: "No se proporcionaron documentos",
    });
  }
};

const processProductPhotos = async (req, res, files) => {
  if (files && files.length > 0) {
    const { uid } = req.params;

    const documentStatus = files.map((file) => ({
      name: path.parse(file.originalname).name,
      reference: generateDocumentURL(file, uid),
    }));
    const resp = await updateUserProfileImage(uid, documentStatus);
    res.send({
      status: "success",
      payload: `Fotos de producto cargada correctamente`,
      duplicated: resp.duplicateDocuments,
    });
  } else {
    res.status(400).send({
      status: "error",
      payload: "No se proporcionaron documentos",
    });
  }
};

const uploadDocuments = async (req, res) => {
  try {
    const files = req.files;

    if (files.profile) {
      await processProfileImage(req, res, files.profile);
    }

    if (files.document) {
      await processDocuments(req, res, files.document);
    }

    if (files.product) {
      await processProductPhotos(req, res, files.product);
    }
  } catch (error) {
    res.send({
      status: "error",
      payload: error.message,
    });
  }
};

const uploadDocumentsPage = async (req, res) => {
  const user = req.user;
  res.render("uploadDocuments", { user, style: "index.css" });
};

const uploadedDocumentsPage = async (req, res) => {
  const uid = req.params.uid;
  try {
    const user = await findUserById(uid);
    const unloadDocs = getUnloadDocs(user);
    const params = { user: user, unloadDocs: unloadDocs };
    res.render("uploadedDocuments", { params, style: "index.css" });
  } catch (error) {
    res.send({
      status: "error",
      payload: error.message,
    });
  }
};

const getList = async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const sort = req.query.sort;
  const query = req.query.query;

  try {
    const user = await findByEmail(req.user.email);
    const users = await getAllUsers(limit, page, sort, query);

    const data = users.filter((user) => user.email !== config.ADMIN_EMAIL);

    const params = { user: user, data: data };

    res.render("users", {
      title: "Users list",
      style: "index.css",
      params,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export {
  getAll,
  getList,
  findById,
  update,
  insert,
  remove,
  addCart,
  changeRole,
  uploadDocuments,
  uploadDocumentsPage,
  uploadedDocumentsPage,
  removeInactive,
};
