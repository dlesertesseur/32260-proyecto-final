import * as dotenv from "dotenv";
dotenv.config();

const productId = "63f12d8121e338781f15305f";
const cartId = "6484b8a8fb73dde3cd2fd1df"

const URL_SERVER = "http://localhost:" + process.env.HTTP_PORT;
const adminCredentials = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

const newUser = {
  first_name: "TEST-USER",
  last_name: "TEST-USER",
  email: "testuser@mail.com",
  age: "99",
  password: "123456789",
};

const userCredentials = {
  email: "jf@gmail.com",
  password: "123",
};

export { adminCredentials, userCredentials, URL_SERVER, newUser, productId, cartId };
