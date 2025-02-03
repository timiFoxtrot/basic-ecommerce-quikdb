import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserByEmail, findUserById } from "../services/auth";
import { ROLES } from "../config/constants/enum";

export const authenticate = ({ isAdmin }: { isAdmin: boolean }) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Invalid authorization header",
      });
    }

    const [, token] = authorization.split(" ");

    try {
      if (!token) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: "Authorization token not found",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };

      const user = await findUserById(decoded.id);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, statusCode: 401, message: "Invalid user" });
      }

      if (isAdmin) {
        if (user.role !== ROLES.ADMIN) {
          return res
            .status(401)
            .json({
              success: false,
              statusCode: 401,
              message: "You are not authorized",
            });
        }
      }

      delete user.password;
      res.locals.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: error || "Invalid token",
      });
    }
  };
};
