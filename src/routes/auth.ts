import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/authenticate";
import { UserRepository } from "../repositories/auth.repository";
import { AuthService } from "../services/auth.service";
import { createUserSchema } from "../validations";

export const authRouter = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

authRouter.post("/signup", createUserSchema, authController.signup);
authRouter.post("/login", authController.login);
authRouter.get("/", authenticate({ isAdmin: true }), authController.getUsers);
