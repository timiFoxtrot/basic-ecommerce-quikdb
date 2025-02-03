import { Router } from "express";
import { AuthController } from "../controllers/auth";
import { authenticate } from "../middlewares/authenticate";

export const authRouter = Router();

authRouter.post("/signup", AuthController.signup());
authRouter.post("/login", AuthController.login());
authRouter.get("/", authenticate({isAdmin: true}), AuthController.getUsers())