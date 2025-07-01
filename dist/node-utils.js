import { writeFileSync } from "fs";
export async function saveJSON(data, filename = "data.json") {
    writeFileSync(filename, JSON.stringify(data, null, 2));
}
