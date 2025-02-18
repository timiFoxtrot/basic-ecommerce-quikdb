import {
  CanisterMethod,
  CreateRecordDataArgs,
  DBRecord,
  DeleteDataArgs,
  GetAllRecordsArgs,
  GetRecordArgs,
  SearchByIndexArgs,
  SearchByMultipleFieldsArgs,
  UpdateDataArgs,
} from "quikdb-cli-beta/v1/sdk";
import { SCHEMA } from "../config/constants/enum";
import { quikdb } from "../config/database";
import { parseRecordString, deserialize } from "../utils/deserialize";

export class ProductRepository {
  async createProduct(params: Record<string, any>) {
    const { id, body, userId, createdAt, updatedAt } = params;
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
    if (insertResult.ok) {
      return insertResult.ok;
    } else {
      console.error(`Error: ${insertResult.err}`);
      throw new Error(insertResult.err);
    }
  }

  async findById(id: string) {
    const getRecordArgs: GetRecordArgs = [SCHEMA.PRODUCT, id];
    const recordResult: any = await quikdb.callCanisterMethod(
      CanisterMethod.GetRecord,
      getRecordArgs
    );
    if (recordResult.ok) {
      return parseRecordString(recordResult.ok);
    } else {
      console.error(`Error: ${recordResult.err}`);
      throw new Error(recordResult.err);
    }
  }

  async findByUserId(userId: string) {
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
        deserialize(record)
      );
      return data;
    } else {
      console.error(`Error: ${searchMultipleResult.err}`);
      if (searchMultipleResult.err === "No matching records found.") return [];
      throw new Error(searchMultipleResult.err);
    }
  }

  async findByIndex(index: string, value: string) {
    const searchByIndexArgs: SearchByIndexArgs = [SCHEMA.PRODUCT, index, value];
    const searchResult: any = await quikdb.callCanisterMethod(
      CanisterMethod.SearchByIndex,
      searchByIndexArgs
    );
    if (searchResult.ok?.length) {
      const data = searchResult.ok.map((record: any) => deserialize(record));
      return data;
    } else {
      console.error(`Error: ${searchResult.err}`);
      if (searchResult.err === "No matching records found.") return [];
      throw new Error(searchResult.err);
    }
  }

  async updateProduct(id: string, payload: Record<string, string>) {
    const updatedFields: [string, string][] = Object.entries(payload);
    const updateDataArgs: UpdateDataArgs = [SCHEMA.PRODUCT, id, updatedFields];
    const updateResult: any = await quikdb.callCanisterMethod(
      CanisterMethod.UpdateData,
      updateDataArgs
    );
    if (updateResult.ok) {
      console.log("Product updated successfully.");
      return updateResult.ok;
    } else {
      console.error(`Error: ${updateResult.err}`);
      throw new Error(updateResult.err);
    }
  }

  async getAllProducts() {
    const getAllRecordsArgs: GetAllRecordsArgs = [SCHEMA.PRODUCT];
    const allRecords: any = await quikdb.callCanisterMethod(
      CanisterMethod.GetAllRecords,
      getAllRecordsArgs
    );
    if (allRecords.ok) {
      const data = allRecords.ok.map((record: any) => deserialize(record));
      return data;
    } else {
      console.error(`Error==: ${allRecords.err}`);
      if (allRecords.err === "No matching records found.") return [];
      throw new Error(allRecords.err);
    }
  }

  async deleteProduct(id: string) {
    const deleteDataArgs: DeleteDataArgs = [SCHEMA.PRODUCT, id];

    const deleteResult: any = await quikdb.callCanisterMethod(
      CanisterMethod.DeleteRecord,
      deleteDataArgs
    );
    if (deleteResult.ok) {
      return deleteResult.ok;
    } else {
      console.error(`Error: ${deleteResult.err}`);
      throw new Error(deleteResult.err);
    }
  }
}
