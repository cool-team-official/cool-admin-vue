import fs from "fs";

export function createModule() {
	let dirs: string[] = [];

	try {
		dirs = fs.readdirSync("./src/modules");
		dirs = dirs.filter((e) => !e.includes("."));
	} catch (err) {}

	return `
		export const dirs = ${JSON.stringify(dirs)}
	`;
}
