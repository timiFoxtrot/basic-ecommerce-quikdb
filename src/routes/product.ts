import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { ProductController } from "../controllers/product";

export const productRouter = Router();

productRouter.post(
  "/",
  authenticate({ isAdmin: false }),
  ProductController.createProduct()
);
productRouter.get(
  "/own-products",
  authenticate({ isAdmin: false }),
  ProductController.getOwnProducts()
);
productRouter.get("/approved", ProductController.getApprovedProducts());
productRouter.patch(
  "/approve/:id",
  authenticate({ isAdmin: true }),
  ProductController.approveProduct()
);
productRouter.get(
  "/",
  authenticate({ isAdmin: true }),
  ProductController.getAllProducts()
);
productRouter.patch(
  "/:id",
  authenticate({ isAdmin: false }),
  ProductController.updateOwnProduct()
);
productRouter.delete(
  "/:id",
  authenticate({ isAdmin: false }),
  ProductController.deleteOwnProduct()
);
