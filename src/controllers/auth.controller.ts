import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await this.authService.signup(req.body);
      res.status(201).json({
        status: "success",
        message: "User inserted successfully.",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        error: error.message || error,
      });
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { token, user } = await this.authService.login(req.body);
      res.status(200).json({
        status: "success",
        message: "Login successful",
        token,
        user,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        error: error.message || error,
      });
    }
  };

  getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const users = await this.authService.getUsers();
      res.status(200).json({
        status: "success",
        message: "Successful",
        data: users,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        error: error.message || error,
      });
    }
  };
}
