import store from "/@/store";
import { last } from "../utils";

export default function (app: any) {
	const files = import.meta.globEager("/src/service/*.ts");
	const ignore = ["request.ts"];

	const modules: any = {};

	for (const i in files) {
		const path: string = i.replace("/src/service/", "");
		const inst: any = files[i].default;

		if (ignore.includes(path)) {
			continue;
		}

		const list = path.split("/");
		const parents = list.slice(0, list.length - 1);
		const name = last(list).replace(".ts", "");

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
			const service = new inst();

			if (name == "index") {
				prev[key] = service;
			} else {
				curr[name] = service;
			}
		} else {
			console.error(`Service must export default in ${files[i]}`);
		}
	}

	app.config.globalProperties.service = store.service = modules;
	app.provide("service", modules);
}
