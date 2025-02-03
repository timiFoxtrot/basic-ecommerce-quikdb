import { RequestHandler } from "express";
import { generateRandomId } from "../utils";
import { comparePassword, hashPassword } from "../utils/password";
import {
  CanisterMethod,
  CreateRecordDataArgs,
  DBRecord,
  GetAllRecordsArgs,
  ResultBool,
  ResultRecords,
} from "quikdb-cli-beta/v1/sdk";
import jwt from "jsonwebtoken";
import { quikdb } from "..";
import { serialize } from "../utils/serialize";
import { ROLES } from "../config/constants/enum";
import { findUserByEmail } from "../services/auth";

export const AuthController = {
  signup:
    (): RequestHandler =>
    async (req, res, next): Promise<any> => {
      try {
        console.log("body", req.body);
        const body = Object.entries(req.body) as [string, string][];

        const { password } = req.body;
        const id = generateRandomId();
        const createdAt = new Date().toISOString();
        const updatedAt = new Date().toISOString();
        const hashedPassword = await hashPassword(password);

        const record: DBRecord = {
          id,
          fields: [
            ...body,
            ["role", ROLES.USER],
            ["password", hashedPassword],
            ["createdAt", createdAt],
            ["updatedAt", updatedAt],
          ],
        };

        const createRecordArgs: CreateRecordDataArgs = ["UserSchema", record];
        const insertResult: any = await quikdb.callCanisterMethod(
          CanisterMethod.CreateRecordData,
          createRecordArgs
        );
        console.log({ insertResult });
        if (insertResult.ok) {
          console.log("User inserted successfully.");
        } else {
          console.error(`Error: ${insertResult.err}`);
          res.status(400).json({ status: "error", message: insertResult.err });
        }
        res
          .status(201)
          .json({ status: "success", message: "User inserted successfully." });
      } catch (error) {
        next(error);
      }
    },
  getUsers: (): RequestHandler => async (req, res, next): Promise<any> => {
    try {
      const getAllRecordsArgs: GetAllRecordsArgs = ["UserSchema"];
      const allRecords: any = await quikdb.callCanisterMethod(
        CanisterMethod.GetAllRecords,
        getAllRecordsArgs
      );
      if (allRecords.ok) {
        const data = allRecords.ok.map((record: any) => {
          const serializedObject = serialize(record);
          delete serializedObject.password;
          return serializedObject;
        });
        return res
          .status(200)
          .json({ status: "success", message: "successful", data });
      } else {
        console.error(`Error: ${allRecords.err}`);
        res.status(400).json({ status: "error", message: allRecords.err });
      }
    } catch (error) {
      next(error);
    }
  },
  login:
    (): RequestHandler =>
    async (req, res, next): Promise<any> => {
      try {
        const { email, password } = req.body;
        const findUser = await findUserByEmail(email);
        if (!findUser) {
          return res
            .status(401)
            .json({ status: "error", message: "Invalid user" });
        }
        const compare = await comparePassword(password, findUser.password);
        if (!compare) {
          return res
            .status(401)
            .json({ status: "error", message: "Invalid user" });
        }

        const token = jwt.sign({ id: findUser.id }, process.env.JWT_SECRET!, {
          expiresIn: "1h",
        });
        delete findUser.password;
        return res.status(200).json({
          status: "success",
          message: "Login successful",
          token,
          user: findUser,
        });

      } catch (error) {
        next(error);
      }
    },
};
