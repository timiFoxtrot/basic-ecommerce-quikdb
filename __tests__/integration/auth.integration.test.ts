// tests/integration/auth.integration.test.ts
import request from "supertest";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "http://localhost:3040/api";

describe("Integration Test: Auth Module", () => {
  describe("[POST] /signupUser", () => {
    it("should sign up a user.", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        username: "testuser",
      };

      const response = await request(BASE_URL)
        .post("/auth/signup")
        .send(userData);

      expect(response.body).toMatchObject({
        status: "success",
        message: "User inserted successfully.",
      });
    }, 10000);
  });
  describe("[POST] /signinUser", () => {
    it("should sign in a user", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(BASE_URL)
        .post("/auth/login")
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body.status).toEqual("success");
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
    }, 10000);
  });
  describe("[GET] /getUsers", () => {
    it("should get all users", async () => {
      const adminCredential = {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      };

      const adminLoginRes = await request(BASE_URL)
        .post("/auth/login")
        .send(adminCredential);

      const adminToken = adminLoginRes.body.token;

      const response = await request(BASE_URL)
        .get("/auth")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toEqual("success");
      expect(Array.isArray(response.body.data)).toBe(true);
    }, 10000);
  });
});
