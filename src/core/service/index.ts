import BaseService from "./base";
import { Service, Permission } from "./decorator";
import { basename } from "../utils";

function deepFiles(list: any[]) {
	const modules: any = {};

	list.forEach((e) => {
		const arr: any[] = e.path.split("/");
		const parents: any[] = arr.slice(0, arr.length - 1);
		const name: string = basename(e.path).replace(".ts", "");

		let curr: any = modules;
		let prev: any = null;
		let key: any = null;

		parents.forEach((k) => {
			if (!curr[k]) {
				curr[k] = {};
			}

			prev = curr;
			curr = curr[k];
			key = k;
		});

		if (name == "index") {
			prev[key] = e.value;
		} else {
			curr[name] = e.value;
		}
	});

	return modules;
}

function useService() {
	const files = import.meta.globEager("/src/service/**/*.ts");
	const d: any = [];

	for (const i in files) {
		if (!i.includes("request.ts")) {
			const value = files[i].default;
			d.push({
				path: i.replace("/src/service/", ""),
				value: new value()
			});
		}
	}

	return deepFiles(d);
}

export { BaseService, Service, Permission, deepFiles, useService };
