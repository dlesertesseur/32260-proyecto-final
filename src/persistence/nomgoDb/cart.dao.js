import mongoose from "mongoose";
import config from "../../config/config.js";
import CartDto from "../../dtos/cart.dto.js";
import cartSchema from "../../models/cart.model.js";
import { logger } from "../../logger/index.js";

mongoose.set("strictQuery", false);
mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME }, (error) => {
  if (error) {
    logger.fatal("Cannot connect to db");
    process.exit();
  }
});

class CartDao {
  constructor() {
    this.collection = mongoose.model("carts", cartSchema);
  }

  async getAll() {
    try {
      const carts = await this.collection.find().lean();
      const list = carts.map((cart) => {
        return new CartDto(cart);
      });

      return list;
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const cart = await this.collection
        .findById(id)
        .populate("products.product")
        .lean();

      const cartDto = new CartDto(cart);

      return cartDto;
    } catch (error) {
      throw error;
    }
  }

  async create(payload) {
    try {
      const cart = await this.collection.create(payload);
      const cartDto = new CartDto(cart);
      return cartDto;
    } catch (error) {
      throw error;
    }
  }

  async update(id, body) {
    try {
      let cart = await this.collection.findOne({ _id: id });
      if (cart) {
        cart.products = body;
        const ret = await this.collection.updateOne(cart);
        const cartDto = new CartDto(ret);
        return cartDto;
      } else {
        throw { message: "not found" };
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(cid) {
    try {
      let cart = await this.collection.findOne({ _id: cid });
      if (cart) {
        const ret = await this.collection.updateOne(
          { _id: cid }, 
          { $set: {products:[]} }
        );
      } else {
        throw { message: "not found" };
      }
    } catch (error) {
      throw error;
    }
  }

  async addProduct(cid, pid, quantity) {
    try {
      let cart = await this.collection.findById(cid).lean();

      //Busca el producto en el carrito
      const cartItem = cart.products.find((item) => {
        return item.product.toString() === pid;
      });

      if (cartItem) {
        //Si ya esta agregado al carrito le suma la cantidad pasada
        cartItem.quantity += quantity;
      } else {
        const item = { product: pid, quantity: quantity };
        cart.products.push(item);
      }

      let ret = await this.collection.findOneAndUpdate({ _id: cid }, cart, {
        new: true,
      });

      const cartDto = new CartDto(ret);
      return cartDto;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(cid, pid, body) {
    try {
      let cartDto = null;
      let cart = await this.collection.findById(cid).lean();

      //Busca el producto en el carrito
      const cartItem = cart.products.find((item) => {
        return item.product.toString() === pid;
      });

      if (cartItem) {
        //Si existe, asigna la cantidad pasada.
        cartItem.quantity = body.quantity;

        const ret = await this.collection.findOneAndUpdate({ _id: cid }, cart, {
          new: true,
        });

        cartDto = new CartDto(cart);
      } else {
        throw { code: 404, message: `Product id: ${pid} Not Found` };
      }

      return cartDto;
    } catch (error) {
      throw error;
    }
  }

  async removeProduct(cid, pid) {
    try {
      let cartDto = null;
      let cart = await this.collection.findById(cid).lean();

      //Busca el producto en el carrito
      const items = cart.products.filter((item) => {
        return item.product.toString() !== pid;
      });

      if (items) {
        cart.products = items;
        const ret = await this.collection.findOneAndUpdate({ _id: cid }, cart, {
          new: true,
        });

        cartDto = new CartDto(cart);
      } else {
        throw { code: 404, message: `Product id: ${pid} Not Found` };
      }

      return cartDto;
    } catch (error) {
      throw error;
    }
  }
}

export default CartDao;
