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
            const getSchemaArgs = ["UserSchema"];
            const schema = yield __1.quikdb.callCanisterMethod(sdk_1.CanisterMethod.GetSchema, getSchemaArgs);
            console.log({ schema });
            if (schema.length > 0) {
                //   console.log("Schema Details:", schema[0]);
                return schema;
            }
            else {
                console.error("Schema not found.");
            }
        });
    }
}
exports.default = new Model();
