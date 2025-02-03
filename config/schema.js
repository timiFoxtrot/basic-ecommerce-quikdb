"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("quikdb-cli-beta/v1/sdk");
const __1 = require("..");
class Model {
    getSchema(schemaName) {
        return __awaiter(this, void 0, void 0, function* () {
            const getSchemaArgs = [schemaName];
            const schema = yield __1.quikdb.callCanisterMethod(sdk_1.CanisterMethod.GetSchema, getSchemaArgs);
            if (schema.length > 0) {
                //   console.log("Schema Details:", schema[0]);
            }
            else {
                console.error("Schema not found.");
            }
            return schema;
        });
    }
    createSchema(schemaName, fields, indexes) {
        return __awaiter(this, void 0, void 0, function* () {
            let schema = yield this.getSchema(schemaName);
            if (!schema.length) {
                // Create schema
                const args = [schemaName, fields, indexes];
                const createSchemaResult = (yield __1.quikdb.callCanisterMethod(sdk_1.CanisterMethod.CreateSchema, args));
                console.log("Create Schema Result:", createSchemaResult);
                if (createSchemaResult.ok) {
                    console.log("Schema created successfully.");
                    schema = yield this.getSchema(schemaName);
                }
                else {
                    console.error(`Error: ${createSchemaResult.err}`);
                }
            }
            return schema;
        });
    }
    deleteSchema(schemaName) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteSchemaArgs = [schemaName];
            const deleteSchemaResult = yield __1.quikdb.callCanisterMethod(sdk_1.CanisterMethod.DeleteSchema, deleteSchemaArgs);
            console.log({ deleteSchemaResult });
            if (deleteSchemaResult) {
                console.log("Schema deleted successfully.");
            }
            else {
                console.error(`Error: ${deleteSchemaResult}`);
            }
        });
    }
}
exports.default = new Model();
