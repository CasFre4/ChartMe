import { writeFileSync } from "fs";

export async function saveJSON(data: object, filename = "data.json") {
  writeFileSync(filename, JSON.stringify(data, null, 2));
}