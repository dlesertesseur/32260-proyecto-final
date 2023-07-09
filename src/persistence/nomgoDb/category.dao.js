import mongoose from "mongoose";
import config from "../../config/config.js";
import CategoryDto from "../../dtos/category.dto.js";
import categorySchema from "../../models/category.model.js";
import { logger } from "../../logger/index.js";

mongoose.set("strictQuery", false);
mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME }, (error) => {
  if (error) {
    logger.fatal("Cannot connect to db");
    process.exit();
  }
});

class CategoryDao {
  constructor() {
    this.collection = mongoose.model("categories", categorySchema);
  }

  async getAll() {
    const categories = await this.collection.find().lean();
    const list = categories.map((cat) => {
      return new CategoryDto(cat);
    });

    return list;
  }

  async findById(id) {
    const cat = await this.collection.findById(id);
    const categoryDto = new CategoryDto(cat);
    return categoryDto;
  }

  async create(category) {
    const cat = await this.collection.create(category);
    const categoryDto = new CategoryDto(cat);
    return categoryDto;
  }

  async update(id, category) {
    const cat = await this.collection.findOneAndUpdate({ _id: id }, category, {
      new: true,
    });
    const categoryDto = new CategoryDto(cat);
    return categoryDto;
  }

  async delete(id) {
    const cat = await this.collection.deleteOne({ _id: id });
    const categoryDto = new CategoryDto(cat);
    return categoryDto;
  }
}

export default CategoryDao;
