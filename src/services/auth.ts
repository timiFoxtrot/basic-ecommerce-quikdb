import {
  CanisterMethod,
  GetRecordArgs,
  ResultRecords,
  SearchByIndexArgs,
} from "quikdb-cli-beta/v1/sdk";
import { quikdb } from "..";
import { parseRecordString, serialize } from "../utils/serialize";

export const findUserByEmail = async (email: string) => {
  const searchByIndexArgs: SearchByIndexArgs = ["UserSchema", "email", email];
  const searchResult: any = await quikdb.callCanisterMethod(
    CanisterMethod.SearchByIndex,
    searchByIndexArgs
  );
  if (searchResult.ok) {
    return searchResult.ok.map((record: any) => serialize(record))[0];
  } else {
    console.error(`Error: ${searchResult.err}`);
    return false;
  }
};

export const findUserById = async (id: string) => {
  const getRecordArgs: GetRecordArgs = ["UserSchema", id];
  const recordResult: any = await quikdb.callCanisterMethod(
    CanisterMethod.GetRecord,
    getRecordArgs
  );
  if (recordResult.ok) {
    return parseRecordString(recordResult.ok)
  } else {
    console.error(`Error: ${recordResult.err}`);
    return false
  }
};


