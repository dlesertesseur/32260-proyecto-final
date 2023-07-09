import mongoose from "mongoose";
import config from "../../config/config.js";
import UserDto from "../../dtos/user.dto.js";
import userSchema from "../../models/user.model.js";
import { createHash, isValidPassword } from "../../util/Crypt.js";
import { logger } from "../../logger/index.js";

mongoose.set("strictQuery", false);
mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME }, (error) => {
  if (error) {
    logger.fatal("UserDao -> Cannot connect to db");
    process.exit();
  }
});

class UserDao {
  constructor() {
    this.collection = mongoose.model("users", userSchema);
  }

  async getAll() {
    try {
      const users = await this.collection.find().lean();

      const list = users.map((user) => {
        return new UserDto(user);
      });

      return list;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      let userDto = null;
      const user = await this.collection.findOne({ email: email }).lean();
      if (user) {
        userDto = new UserDto(user);
      }

      return userDto;
    } catch (error) {
      throw error;
    }
  }

  async create(data) {
    try {
      const user = await this.collection.create(data);
      const userDto = new UserDto(user);
      return userDto;
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      let user = await this.collection.findOneAndUpdate({ _id: id }, data, {
        new: true,
      });

      const userDto = new UserDto(user);
      return userDto;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(id, password) {
    try {
      const newPassword = createHash(password);
      let user = await this.collection.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            password: newPassword,
          },
        },
        {
          new: true,
        }
      );

      const userDto = new UserDto(user);
      return userDto;
    } catch (error) {
      throw error;
    }
  }

  async updateRole(id, role) {
    try {
      let user = await this.collection.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            role: role,
          },
        },
        {
          new: true,
        }
      );

      const userDto = new UserDto(user);
      return userDto;
    } catch (error) {
      throw error;
    }
  }

  async remove(id) {
    try {
      await this.collection.deleteOne({ _id: id });
    } catch (error) {
      throw error;
    }
  }

  async authenticate(email, password) {
    try {
      let userDto = await this.findByEmail(email);
      if (userDto) {
        if (isValidPassword(userDto, password)) {
          return userDto;
        } else {
          throw { status: 401, message: "Unauthorized - password error" };
        }
      } else {
        throw { status: 404, message: "email not found" };
      }
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const user = await this.collection.findById(id).lean();

      const userDto = new UserDto(user);

      return userDto;
    } catch (error) {
      throw error;
    }
  }

  async register(payload) {
    try {
      let userFound = await this.findByEmail(payload.email);
      if (userFound) {
        throw { status: 409, message: "Conflict - User email already exists" };
      } else {
        const user = await this.collection.create(payload);
        const userDto = new UserDto(user);
        return userDto;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateDocumentsStatus(uid, documentStatus) {
    try {
      const user = await this.findById(uid);
      if (user) {
        const duplicateDocuments = [];
        const documentsToAdd = documentStatus.map((doc) => ({
          name: doc.name,
          reference: doc.reference,
        }));

        documentsToAdd.forEach((newDoc) => {
          const alreadyExists = user.documents.some(
            (existingDoc) => existingDoc.name === newDoc.name
          );

          if (!alreadyExists) {
            user.documents.push(newDoc);
          } else {
            duplicateDocuments.push(newDoc.name);
          }
        });

        await this.update(user.id, { documents: user.documents });
        return {
          status: 200,
          message: "document uploaded",
          duplicateDocuments: duplicateDocuments,
        };
      } else {
        throw new Error("Usuario Inexistente");
      }
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default UserDao;
