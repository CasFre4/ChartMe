// "use server";
// import {writeFileSync} from "fs"
export async function saveJSON(data: object, filename = "data.json") {
  if (typeof window !== "undefined") {
    throw new Error("saveJSON can only run on the server");
  }
  // const { writeFileSync } = await eval('import("node:fs")');
  try {
    // Use require() which is easier to conditionally load
    const fs = await eval('import("fs")');
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Node.js fs module not available");
  }
  // writeFileSync(filename, JSON.stringify(data, null, 2));
}
