import fs from "fs";

export function getModules() {
	try {
		const dirs = fs.readdirSync("./src/modules");
		return dirs.filter((e) => !e.includes("."));
	} catch (e) {
		return [];
	}
}
