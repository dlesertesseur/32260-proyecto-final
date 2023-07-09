import supertest from "supertest";
import chai from "chai";
import { URL_SERVER, adminCredentials, newUser } from "../data.js";

const expect = chai.expect;
const requester = supertest(URL_SERVER);
let cookie = null;

describe("E-COMMERSE - integration test - SESSION", () => {
  describe("Admin login test", () => {
    it("debe autenticarse correctamente con credenciales de administrador", async () => {
      const result = await requester
        .post("/api/auth/login")
        .send(adminCredentials)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

      const cookieResult = result.headers["set-cookie"][0];

      expect(cookieResult).to.be.ok;

      const cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      expect(cookie.name).to.be.ok.and.eql("authToken");
    });

    it("debe cerrar sesion correctamente con credenciales de administrador", async () => {
      const result = await requester
        .post("/api/auth/logout")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

      expect(result.statusCode).to.be.equal(302);
    });
  });

  describe("User test", () => {
    it("debe registrar un usuario correctamente", async () => {
      const result = await requester
        .post("/api/auth/register")
        .send(newUser)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

      const { statusCode, ok, _body } = result;

      expect(result.statusCode).to.be.equal(302);
    });

    it("debe autenticarse correctamente con credenciales del usuario", async () => {
      const result = await requester
        .post("/api/auth/login")
        .send(newUser)
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

    it("debe cerrar sesion correctamente", async () => {
      const result = await requester
        .post("/api/auth/logout")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

      expect(result.statusCode).to.be.equal(302);
    });
  });
});
