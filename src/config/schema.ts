import {
  CanisterMethod,
  CreateRecordDataArgs,
  CreateSchemaArgs,
  DBRecord,
  DeleteSchemaArgs,
  Field,
  GetSchemaArgs,
  ResultBool,
  Schema,
} from "quikdb-cli-beta/v1/sdk";
import { generateRandomId } from "../utils";
import { hashPassword } from "../utils/password";
import { ROLES } from "./constants/enum";
import { quikdb } from "./database";

class Model {
  async getSchema(schemaName: string) {
    const getSchemaArgs: GetSchemaArgs = [schemaName];
    const schema: Schema[] = await quikdb.callCanisterMethod(
      CanisterMethod.GetSchema,
      getSchemaArgs
    );
    if (schema.length > 0) {
      //   console.log("Schema Details:", schema[0]);
    } else {
      console.error("Schema not found.");
    }
    return schema;
  }

  async createSchema(schemaName: string, fields: Field[], indexes: string[]) {
    let schema = await this.getSchema(schemaName);

    if (!schema.length) {
      // Create schema
      const args: CreateSchemaArgs = [schemaName, fields, indexes];
      const createSchemaResult: any = (await quikdb.callCanisterMethod(
        CanisterMethod.CreateSchema,
        args
      )) as ResultBool;
      console.log("Create Schema Result:", createSchemaResult);
      if (createSchemaResult.ok) {
        console.log("Schema created successfully.");
        schema = await this.getSchema(schemaName);

        if (schemaName === "UserSchema") {
          // insert an admin user
          const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
          const id = generateRandomId();
          const hashedPassword = await hashPassword(ADMIN_PASSWORD!);
          const record: DBRecord = {
            id,
            fields: [
              ["username", ADMIN_USERNAME!],
              ["email", ADMIN_EMAIL!],
              ["password", hashedPassword],
              ["role", ROLES.ADMIN],
              ["createdAt", new Date().toISOString()],
              ["updatedAt", new Date().toISOString()],
            ],
          };

          const createRecordArgs: CreateRecordDataArgs = ["UserSchema", record];
          await quikdb.callCanisterMethod(
            CanisterMethod.CreateRecordData,
            createRecordArgs
          );
        }
      } else {
        console.error(`Error: ${createSchemaResult.err}`);
      }
    }
    return schema;
  }

  async deleteSchema(schemaName: string) {
    const deleteSchemaArgs: DeleteSchemaArgs = [schemaName];
    const deleteSchemaResult: ResultBool = await quikdb.callCanisterMethod(
      CanisterMethod.DeleteSchema,
      deleteSchemaArgs
    );
    console.log({ deleteSchemaResult });
    if (deleteSchemaResult) {
      console.log("Schema deleted successfully.");
    } else {
      console.error(`Error: ${deleteSchemaResult}`);
    }
  }
}

export default new Model();
