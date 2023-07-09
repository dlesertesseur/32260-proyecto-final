import CategoryDaoFactory from "../factories/category.dao.factory.js";
import Category from "../entities/category.entity.js";
import config from "../config/config.js";

class CategoryRepository {
  constructor() {
    this.dao = CategoryDaoFactory.create(config.PERSISTENCE);
  }

  async getAll() {
    const categories = await this.dao.getAll();
    const entities = categories.map((cat) => new Category(cat));
    return entities;
  }

  async findById(id) {
    const cat = await this.dao.findById(id);
    const entity = new Category(cat);
    return entity;
  }

  async create(payload) {
    const cat = await this.dao.create(payload);
    const entity = new Category(cat);
    return entity;
  }

  async update(id, body) {
    const cat = await this.dao.update(id, body);
    const entity = new Category(cat);
    return entity;
  }

  async delete(id) {
    await this.dao.delete(id);
    return (id);
  }
}

export default CategoryRepository;
