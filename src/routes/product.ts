import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { ProductService } from "../services/product.service";
import { ProductCOntroller } from "../controllers/product.controller";
import { ProductRepository } from "../repositories/product.repository";
import { createProductSchema } from "../validations";

export const productRouter = Router();

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductCOntroller(productService);

productRouter.post(
  "/",
  authenticate({ isAdmin: false }),
  createProductSchema,
  productController.createProduct
);
productRouter.get(
  "/own-products",
  authenticate({ isAdmin: false }),
  productController.getOwnProducts
);
productRouter.get("/approved", productController.getApprovedProducts);
productRouter.patch(
  "/approve/:id",
  authenticate({ isAdmin: true }),
  productController.approveProduct
);
productRouter.get(
  "/",
  authenticate({ isAdmin: true }),
  productController.getAllProducts
);
productRouter.patch(
  "/:id",
  authenticate({ isAdmin: false }),
  productController.updateOwnProduct
);
productRouter.delete(
  "/:id",
  authenticate({ isAdmin: false }),
  productController.deleteOwnProduct
);
