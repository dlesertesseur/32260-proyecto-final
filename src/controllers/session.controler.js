import { findByEmail } from "../services/user.service.js";

const current = async (req, res) => {
  try {
    const user = await findByEmail(req.user.email);
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export {current}
