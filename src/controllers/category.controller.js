import {
  getAllCategories,
  findCategoryById,
  insertCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service.js";

const getAll = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.send(categories);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const findById = async (req, res) => {
  const pid = req.params.pid;
  try {
    const category = await findCategoryById(pid);
    res.send(category);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const insert = async (req, res) => {
  try {
    const ret = await insertCategory(req.body);
    res.send(ret);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const update = async (req, res) => {
  const pid = req.params.pid;

  if (pid) {
    try {
      const category = await updateCategory(pid, req.body);
      res.send(category);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  } else {
    res.status(400).send({ message: "Bad request" });
  }
};

const remove = async (req, res) => {
  const pid = req.params.pid;

  if (pid) {
    try {
      const category = await deleteCategory(pid);
      res.send(category);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  } else {
    res.status(400).send({ message: "Bad request" });
  }
};
export { getAll, findById, update, insert, remove };
