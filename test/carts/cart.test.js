import supertest from "supertest";
import chai from "chai";
import {
  URL_SERVER,
  adminCredentials,
  cartId,
  newUser,
  productId,
  userCredentials,
} from "../data.js";

const expect = chai.expect;
const requester = supertest(URL_SERVER);
let cookie = null;

describe("E-COMMERSE - integration test - CART", () => {
  describe("Carrito", () => {
    it("debe autenticarse correctamente con credenciales del usuario", async () => {
      const result = await requester
        .post("/api/auth/login")
        .send(userCredentials)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

      const cookieResult = result.headers["set-cookie"][0];

      expect(cookieResult).to.be.ok;

      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      expect(cookie.name).to.be.ok.and.eql("authToken");
    });

    it("debe obtener un carrito por id correctamente", async () => {
      const result = await requester
        .get(`/api/carts/${cartId}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Cookie", `${cookie.name}=${cookie.value}`);

      const { statusCode, ok, _body } = result;

      expect(statusCode).to.be.equal(200);
    });

    it("debe agregar un producto al carrito correctamente", async () => {
      const result = await requester
        .post(`/api/carts/${cartId}/products/${productId}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Cookie", `${cookie.name}=${cookie.value}`);

      const { statusCode, ok, body } = result;

      expect(statusCode).to.be.equal(200);
      expect(body.id).to.be.equal(cartId);
    });

    it("debe eliminar un producto al carrito correctamente", async () => {
      const result = await requester
        .delete(`/api/carts/${cartId}/products/${productId}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Cookie", `${cookie.name}=${cookie.value}`);

      const { statusCode, ok, body } = result;

      expect(statusCode).to.be.equal(200);
      expect(body.id).to.be.equal(cartId);
    });

    it("debe cerrar sesion correctamente", async () => {
      const result = await requester
        .post("/api/auth/logout")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

      expect(result.statusCode).to.be.equal(302);
    });
  });
});
