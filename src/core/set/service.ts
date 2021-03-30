import store from "/@/store";
import { last } from "../utils";

export default function (app: any) {
	const files = import.meta.globEager("/src/service/*.ts");
	const ignore = ["request.ts"];

	const modules: any = {};

	for (let i in files) {
		const path: string = i.replace("/src/service/", "");
		const inst: any = files[i].default;

		if (ignore.includes(path)) {
			continue;
		}

		let list = path.split("/");
		let parents = list.slice(0, list.length - 1);
		let name = last(list).replace(".ts", "");

		let curr: any = modules;
		let prev: any = null;
		let key: any = null;

		parents.forEach((k: any) => {
			if (!curr[k]) {
				curr[k] = {};
			}

			prev = curr;
			curr = curr[k];
			key = k;
		});

		if (inst) {
			let service = new inst();

			if (name == "index") {
				prev[key] = service;
			} else {
				curr[name] = service;
			}
		} else {
			console.error(`Service must export default in ${files[i]}`);
		}
	}

	app.config.globalProperties.$service = store.$service = modules;
	app.provide("service", modules);
}
