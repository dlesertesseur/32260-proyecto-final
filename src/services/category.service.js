import CategoryRepository from "../repositories/category.repository.js";

const repository = new CategoryRepository();

const getAllCategories = async () => {
  let ret = await repository.getAll();
  return ret;
};

const findCategoryById = async (id) => {
  let ret = await repository.findById(id);
  return ret;
};

const insertCategory = async (category) => {
  let ret = await repository.insert(category);
  return ret;
};

const updateCategory = async (pid, body) => {
  let ret = await repository.update(pid, body);
  return ret;
};

const deleteCategory = async (pid) => {
  let ret = await repository.delete(pid);
  return ret;
};
export { getAllCategories, findCategoryById, insertCategory, updateCategory, deleteCategory };
