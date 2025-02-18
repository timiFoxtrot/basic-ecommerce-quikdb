import {
  CanisterMethod,
  CreateRecordDataArgs,
  DBRecord,
  GetAllRecordsArgs,
  GetRecordArgs,
  SearchByIndexArgs,
} from "quikdb-cli-beta/v1/sdk";
import { quikdb } from "../config/database";
import { ROLES, SCHEMA } from "../config/constants/enum";
import { parseRecordString, deserialize } from "../utils/deserialize";

export class UserRepository {
  async createUser(params: Record<string, any>): Promise<any> {
    const { id, body, hashedPassword, createdAt, updatedAt } = params;

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

    const createRecordArgs: CreateRecordDataArgs = [SCHEMA.USER, record];
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

  async getAllUsers(): Promise<any[]> {
    const getAllRecordsArgs: GetAllRecordsArgs = ["UserSchema"];
    const allRecords: any = await quikdb.callCanisterMethod(
      CanisterMethod.GetAllRecords,
      getAllRecordsArgs
    );
    if (allRecords.ok) {
      const data = allRecords.ok.map((record: any) => {
        const serializedObject = deserialize(record);
        delete serializedObject.password;
        return serializedObject;
      });
      return data;
    } else {
      console.error(`Error: ${allRecords.err}`);
      throw new Error(allRecords.err);
    }
  }

  async findUserByEmail(email: string): Promise<any> {
    const searchByIndexArgs: SearchByIndexArgs = [SCHEMA.USER, "email", email];
    const searchResult: any = await quikdb.callCanisterMethod(
      CanisterMethod.SearchByIndex,
      searchByIndexArgs
    );
    if (searchResult.ok) {
      return searchResult.ok.map((record: any) => deserialize(record))[0];
    } else {
      console.error(`Error: ${searchResult.err}`);
      return false;
    }
  }

  async findUserById(id: string): Promise<any> {
    const getRecordArgs: GetRecordArgs = ["UserSchema", id];
    const recordResult: any = await quikdb.callCanisterMethod(
      CanisterMethod.GetRecord,
      getRecordArgs
    );
    if (recordResult.ok) {
      return parseRecordString(recordResult.ok);
    } else {
      console.error(`Error: ${recordResult.err}`);
      return false;
    }
  }
}
