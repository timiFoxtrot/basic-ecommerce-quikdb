import { randomBytes } from "crypto";

export const generateRandomId = () => {
  return randomBytes(4).toString("hex"); // Convert to hexadecimal string
};
