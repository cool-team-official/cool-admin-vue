import fs from "fs";

export function getModules() {
	return new Promise((resolve, reject) => {
		try {
			const dirs = fs.readdirSync("./src/modules");
			resolve(dirs.filter((e) => !e.includes(".")));
		} catch (e) {
			reject(e);
		}
	});
}
