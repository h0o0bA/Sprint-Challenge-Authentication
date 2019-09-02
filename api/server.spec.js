const request = require("supertest");

const server = require("./server");

describe("users authentication, login and register", () => {
  // ==================== POST LOGIN TESTS ====================
  describe("POST /login", () => {
    it("correct username and password, returns status code 200", async () => {
      let response = await request(server)
        .post("/api/auth/login/")
        .send({ username: "test", password: "password" });
      expect(response.status).toBe(200);
    });

    it("incorrect username and password, returns status code 401", async () => {
      let response = await request(server)
        .post("/api/auth/login/")
        .send({ username: "test", password: "1234" });
      expect(response.status).toBe(401);
    });
  });

  // ==================== POST REGISTER TESTS ====================
  describe("POST /Register", () => {
    it("username and password, returns status code 201", async () => {
      let response = await request(server)
        .post("/api/auth/register/")
        .send({ username: "test4", password: "password4" });
      expect(response.status).toBe(201);
    });

    it("username only, returns status code 500", async () => {
      let response = await request(server)
        .post("/api/auth/register/")
        .send({ username: "test5" });
      expect(response.status).toBe(500);
    });
  });
});
