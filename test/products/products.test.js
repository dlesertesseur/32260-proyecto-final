import supertest from "supertest";
import chai from "chai";
import {
  URL_SERVER,
  adminCredentials,
  newUser,
  productId,
  userCredentials,
} from "../data.js";

const expect = chai.expect;
const requester = supertest(URL_SERVER);
let cookie = null;

describe("E-COMMERSE - integration test - PRODUCTS", () => {
  describe("Products", () => {
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

    it("debe obtener la list de products correctamente", async () => {
      const result = await requester
        .get("/api/products")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Cookie", `${cookie.name}=${cookie.value}`);

      const { statusCode, ok, _body } = result;

      expect(statusCode).to.be.equal(200);
      expect(_body.status).to.be.ok.and.eql("success");
    });

    it("debe obtener un producto por id correctamente", async () => {
      const result = await requester
        .get(`/api/products/${productId}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Cookie", `${cookie.name}=${cookie.value}`);

      const { statusCode, _body } = result;

      expect(statusCode).to.be.equal(200);
      expect(_body.id).to.be.ok.and.eql(productId);
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
