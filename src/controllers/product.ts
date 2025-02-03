import { RequestHandler } from "express";
import { generateRandomId } from "../utils";
import {
  CanisterMethod,
  CreateRecordDataArgs,
  DBRecord,
  DeleteDataArgs,
  GetAllRecordsArgs,
  SearchByIndexArgs,
  SearchByMultipleFieldsArgs,
  UpdateDataArgs,
} from "quikdb-cli-beta/v1/sdk";
import { quikdb } from "..";
import { serialize } from "../utils/serialize";
import { SCHEMA, STATUS } from "../config/constants/enum";
import { findProductById, findProductByMulitple } from "../services/product";

export const ProductController = {
  createProduct:
    (): RequestHandler =>
    async (req, res, next): Promise<any> => {
      try {
        const userId = res.locals.user.id;
        const body = Object.entries(req.body) as [string, string | number][];
        console.log({ body });
        const id = generateRandomId();
        const createdAt = new Date().toISOString();
        const updatedAt = new Date().toISOString();

        const record: DBRecord = {
          id,
          fields: [
            ...body,
            ["userId", userId],
            ["status", "pending"],
            ["createdAt", createdAt],
            ["updatedAt", updatedAt],
          ],
        };

        const createRecordArgs: CreateRecordDataArgs = [SCHEMA.PRODUCT, record];
        const insertResult: any = await quikdb.callCanisterMethod(
          CanisterMethod.CreateRecordData,
          createRecordArgs
        );
        console.log({ insertResult });
        if (insertResult.ok) {
          console.log("Product inserted successfully.");
        } else {
          console.error(`Error: ${insertResult.err}`);
          return res
            .status(400)
            .json({ status: "error", message: insertResult.err });
        }
        res.status(201).json({
          status: "success",
          message: "Product inserted successfully",
        });
      } catch (error: any) {
        res.status(400).json({
          status: "error",
          message: "failed",
          error: error.message || error,
        });
        next(error);
      }
    },
  getOwnProducts:
    (): RequestHandler =>
    async (req, res, next): Promise<any> => {
      try {
        const userId = res.locals.user.id;

        const searchByMultipleFieldsArgs: SearchByMultipleFieldsArgs = [
          SCHEMA.PRODUCT,
          [["userId", userId]],
        ];
        const searchMultipleResult: any = await quikdb.callCanisterMethod(
          CanisterMethod.SearchByMultipleFields,
          searchByMultipleFieldsArgs
        );
        if (searchMultipleResult.ok.length) {
          const data = searchMultipleResult.ok.map((record: any) =>
            serialize(record)
          );
          return res
            .status(200)
            .json({ status: "success", message: "successful", data });
        } else {
          console.error(`Error: ${searchMultipleResult.err}`);
          return res
            .status(404)
            .json({ status: "error", message: searchMultipleResult.err });
        }
      } catch (error: any) {
        res.status(400).json({
          status: "error",
          message: "failed",
          error: error.message || error,
        });
        next(error);
      }
    },
  getApprovedProducts:
    (): RequestHandler =>
    async (req, res, next): Promise<any> => {
      try {
        const searchByIndexArgs: SearchByIndexArgs = [
          SCHEMA.PRODUCT,
          "status",
          STATUS.APPROVED,
        ];
        const searchResult: any = await quikdb.callCanisterMethod(
          CanisterMethod.SearchByIndex,
          searchByIndexArgs
        );
        if (searchResult.ok.length) {
          const data = searchResult.ok.map((record: any) => serialize(record));
          return res
            .status(200)
            .json({ status: "success", message: "successful", data });
        } else {
          console.error(`Error: ${searchResult.err}`);
          return res
            .status(404)
            .json({ status: "error", message: searchResult.err });
        }
      } catch (error: any) {
        res.status(400).json({
          status: "error",
          message: "failed",
          error: error.message || error,
        });
        next(error);
      }
    },
  approveProduct:
    (): RequestHandler =>
    async (req, res, next): Promise<any> => {
      try {
        const productId = req.params.id;
        const updatedFields: [string, string][] = [["status", STATUS.APPROVED]];
        const updateDataArgs: UpdateDataArgs = [
          SCHEMA.PRODUCT,
          productId,
          updatedFields,
        ];
        const updateResult: any = await quikdb.callCanisterMethod(
          CanisterMethod.UpdateData,
          updateDataArgs
        );
        if (updateResult.ok) {
          console.log("Product updated successfully.");
          return res.status(200).json({
            status: "success",
            message: "Product approved.",
          });
        } else {
          console.error(`Error: ${updateResult.err}`);
          return res.status(400).json({
            status: "error",
            message: updateResult.err,
          });
        }
      } catch (error: any) {
        res.status(400).json({
          status: "error",
          message: "failed",
          error: error.message || error,
        });
        next(error);
      }
    },
  getAllProducts:
    (): RequestHandler =>
    async (req, res, next): Promise<any> => {
      try {
        const getAllRecordsArgs: GetAllRecordsArgs = [SCHEMA.PRODUCT];
        const allRecords: any = await quikdb.callCanisterMethod(
          CanisterMethod.GetAllRecords,
          getAllRecordsArgs
        );
        if (allRecords.ok.length) {
          const data = allRecords.ok.map((record: any) => serialize(record));
          return res
            .status(200)
            .json({ status: "success", message: "successful", data });
        } else {
          console.error(`Error: ${allRecords.err}`);
          return res
            .status(404)
            .json({ status: "error", message: allRecords.err });
        }
      } catch (error: any) {
        res.status(400).json({
          status: "error",
          message: "failed",
          error: error.message || error,
        });
        next(error);
      }
    },
  updateOwnProduct:
    (): RequestHandler =>
    async (req, res, next): Promise<any> => {
      try {
        const userId = res.locals.user.id;
        const productId = req.params.id;
        const updatedAt = new Date().toISOString();
        const body = Object.entries(req.body) as [string, string][];

        const updatedFields: [string, string][] = [
          ...body,
          ["updatedAt", updatedAt],
        ];
        const updateDataArgs: UpdateDataArgs = [
          SCHEMA.PRODUCT,
          productId,
          updatedFields,
        ];

        const product = await findProductById(productId);
        if (product && product.userId !== userId) {
          return res.status(401).json({
            status: "error",
            message: "You cannot update this product",
          });
        }

        const updateResult: any = await quikdb.callCanisterMethod(
          CanisterMethod.UpdateData,
          updateDataArgs
        );
        if (updateResult.ok) {
          return res.status(200).json({
            status: "success",
            message: "Product updated successfully.",
          });
        } else {
          console.error(`Error: ${updateResult.err}`);
          return res.status(400).json({
            status: "error",
            message: updateResult.err,
          });
        }
      } catch (error: any) {
        res.status(400).json({
          status: "error",
          message: "failed",
          error: error.message || error,
        });
        next(error);
      }
    },
  deleteOwnProduct:
    (): RequestHandler =>
    async (req, res, next): Promise<any> => {
      try {
        const userId = res.locals.user.id;
        const productId = req.params.id;
        const deleteDataArgs: DeleteDataArgs = [SCHEMA.PRODUCT, productId];

        const product = await findProductById(productId);
        if (product && product.userId !== userId) {
          return res.status(401).json({
            status: "error",
            message: "You cannot delete this product",
          });
        }

        const deleteResult: any = await quikdb.callCanisterMethod(
          CanisterMethod.DeleteRecord,
          deleteDataArgs
        );
        if (deleteResult.ok) {
          return res.status(200).json({
            status: "success",
            message: "Product deleted successfully.",
          });
        } else {
          console.error(`Error: ${deleteResult.err}`);
          return res.status(400).json({
            status: "error",
            message: deleteResult.err,
          });
        }
      } catch (error: any) {
        res.status(400).json({
          status: "error",
          message: "failed",
          error: error.message || error,
        });
        next(error);
      }
    },
};
