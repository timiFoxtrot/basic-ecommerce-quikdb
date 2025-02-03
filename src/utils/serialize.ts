type Raw = {
  id: string;
  fields: [string, string][];
};

export const serialize = (input: Raw) => {
  let serializedObject: Record<string, any> = {};
  serializedObject["id"] = input.id;
  for (let field of input.fields) {
    serializedObject[field[0]] = field[1];
  }

  return serializedObject;
};

export const parseRecordString = (
  recordString: string
): Record<string, any> => {
  const lines = recordString
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
  const result: Record<string, any> = {};

  for (const line of lines) {
    if (line.startsWith("Record ID:")) {
      result.id = line.replace("Record ID: ", "").trim();
    } else if (line.startsWith("Size:") || line.startsWith("Fields:")) {
      continue;
    } else if (line.includes(":")) {
      const [key, value] = line.split(":").map((part) => part.trim());

      // Try to parse numbers and timestamps
      if (!isNaN(Number(value))) {
        result[key] = Number(value);
      } else if (key.endsWith("At") || key.includes("timestamp")) {
        result[key] = isNaN(Number(value))
          ? value
          : new Date(Number(value) / 1000);
      } else {
        result[key] = value;
      }
    }
  }

  return result;
};
