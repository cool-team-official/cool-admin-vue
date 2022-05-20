import fs from "fs";
import { join } from "path";

export function getModules() {
	try {
		const dirs = fs.readdirSync(join(__dirname, "../../../../src/modules"));
		return Promise.resolve(dirs.filter((e) => !e.includes(".")));
	} catch (e) {
		return Promise.reject(e);
	}
}
