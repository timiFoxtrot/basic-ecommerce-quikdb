import express from "express";
import dotenv from "dotenv";
import { CanisterMethod, QuikDB, ResultBool } from "quikdb-cli-beta/v1/sdk";
import schema from "./config/schema";
import { authRouter } from "./routes/auth";
import { productRouter } from "./routes/product";

dotenv.config();
const app = express();
app.use(express.json());

export const quikdb = new QuikDB();
(async () => {
  try {
    await quikdb.init();
    const initOwnerResult: ResultBool = (await quikdb.callCanisterMethod(
      CanisterMethod.InitOwner,
      []
    )) as ResultBool;
    if (initOwnerResult) {
      console.log("Owner initialized successfully.");
    } else {
      console.error(`Error: ${initOwnerResult}`);
    }

    // await schema.deleteSchema("UserSchema");
    // await schema.deleteSchema("ProductSchema");

    // create UserSchema
    const userFields = [
      { name: "username", unique: false, fieldType: "Text" },
      { name: "email", unique: true, fieldType: "Text" },
      { name: "password", unique: false, fieldType: "Text" },
      { name: "role", unique: false, fieldType: "Text" },
      { name: "createdAt", unique: false, fieldType: "Text" },
      { name: "updatedAt", unique: false, fieldType: "Text" },
    ];
    const userIndexes = ["email"];
    const userSchema = await schema.createSchema(
      "UserSchema",
      userFields,
      userIndexes
    );
    console.log({ userSchema });

    // create ProductSchema
    const productFields = [
      { name: "name", unique: true, fieldType: "Text" },
      { name: "description", unique: false, fieldType: "Text" },
      { name: "price", unique: false, fieldType: "Text" },
      { name: "status", unique: false, fieldType: "Text" },
      { name: "userId", unique: false, fieldType: "Text" },
      { name: "createdAt", unique: false, fieldType: "Text" },
      { name: "updatedAt", unique: false, fieldType: "Text" },
    ];
    const productIndexes = ["userId", "status"];
    const productSchema = await schema.createSchema(
      "ProductSchema",
      productFields,
      productIndexes
    );
    console.log({ productSchema });
  } catch (error) {
    console.log(error);
  }
})();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
