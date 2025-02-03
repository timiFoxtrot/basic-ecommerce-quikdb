import {
  CanisterMethod,
  GetRecordArgs,
  SearchByMultipleFieldsArgs,
} from "quikdb-cli-beta/v1/sdk";
import { SCHEMA } from "../config/constants/enum";
import { quikdb } from "..";
import { parseRecordString } from "../utils/serialize";

export const findProductByMulitple = async (id: string, userId: string) => {
  const searchByMultipleFieldsArgs: SearchByMultipleFieldsArgs = [
    SCHEMA.PRODUCT,
    [
      ["id", id],
      ["userId", userId],
    ],
  ];
  const searchMultipleResult: any = await quikdb.callCanisterMethod(
    CanisterMethod.SearchByMultipleFields,
    searchByMultipleFieldsArgs
  );
  if (searchMultipleResult.ok) {
    searchMultipleResult.ok.forEach((record: any) => console.log(record));
  } else {
    console.error(`Error: ${searchMultipleResult.err}`);
  }
};

export const findProductById = async (id: string) => {
  const getRecordArgs: GetRecordArgs = [SCHEMA.PRODUCT, id];
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

// Create Schema Result: { err: 'You can define up to 2 indexes only.' }
// Error: You can define up to 2 indexes only.
