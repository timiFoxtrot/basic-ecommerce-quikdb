import request from "supertest";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "http://localhost:3040/api";

describe("Integration Test: Product Module", () => {
  let productId: string;
  describe("[POST] /createProduct", () => {
    it("should create a product.", async () => {
      const productData = {
        name: "test product",
        description: "my test product",
        price: "300",
      };

      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const userLoginResponse = await request(BASE_URL)
        .post("/auth/login")
        .send(credentials);

      const userToken = userLoginResponse.body.token;

      const response = await request(BASE_URL)
        .post("/products")
        .set("Authorization", `Bearer ${userToken}`)
        .send(productData);

      expect(response.body).toMatchObject({
        status: "success",
        message: "Product inserted successfully",
        data: {},
      });
    }, 10000);
  });
  describe("[GET] /getOwnProduct", () => {
    it("should get all own products", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const userLoginResponse = await request(BASE_URL)
        .post("/auth/login")
        .send(credentials);

      const userToken = userLoginResponse.body.token;

      const response = await request(BASE_URL)
        .get("/products/own-products")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toEqual("success");
      expect(Array.isArray(response.body.data)).toBe(true);
    }, 10000);
  });
  describe("[GET] getAllProducts", () => {
    it("should get all products", async () => {
      const adminCredentials = {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      };

      const adminLoginResponse = await request(BASE_URL)
        .post("/auth/login")
        .send(adminCredentials);

      const adminToken = adminLoginResponse.body.token;

      const response = await request(BASE_URL)
        .get("/products")
        .set("Authorization", `Bearer ${adminToken}`);

      productId = response.body.data[response.body.data.length - 1].id;

      expect(response.status).toBe(200);
      expect(response.body.status).toEqual("success");
      expect(Array.isArray(response.body.data)).toBe(true);
    }, 10000);
  });
  describe("[PATCH] /approveProduct", () => {
    it("should approve product", async () => {
      const adminCredentials = {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      };

      const adminLoginResponse = await request(BASE_URL)
        .post("/auth/login")
        .send(adminCredentials);

      const adminToken = adminLoginResponse.body.token;

      const response = await request(BASE_URL)
        .patch(`/products/approve/${productId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.body).toMatchObject({
        status: "success",
        message: "Product approved.",
        data: true,
      });
    }, 10000);
  });
  describe("[GET] /getApprovedProducts", () => {
    it("should get approved products", async () => {
      const response = await request(BASE_URL).get("/products/approved");
      expect(response.status).toBe(200);
      expect(response.body.status).toEqual("success");
      expect(Array.isArray(response.body.data.data)).toBe(true);
    }, 10000);
  });
  describe("[PATCH] /updateOwnProduct", () => {
    it("should update own product", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const productData = {
        name: "second product updatedknjkj",
        description: "updated description",
      };

      const userLoginResponse = await request(BASE_URL)
        .post("/auth/login")
        .send(credentials);

      const userToken = userLoginResponse.body.token;

      const response = await request(BASE_URL)
        .patch(`/products/${productId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(productData);

      expect(response.body).toMatchObject({
        status: "success",
        message: "Product updated successfully.",
        data: true,
      });
    }, 10000);
  });
  describe("[DELETE] /deleteOwnProduct", () => {
    it("should delete own product", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };
      const userLoginResponse = await request(BASE_URL)
        .post("/auth/login")
        .send(credentials);

      const userToken = userLoginResponse.body.token;

      const response = await request(BASE_URL)
        .delete(`/products/${productId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.body).toMatchObject({
        status: "success",
        message: "Product deleted successfully.",
        data: true,
      });
    }, 10000);
  });
});
