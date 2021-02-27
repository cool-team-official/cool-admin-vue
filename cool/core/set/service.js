import Vue from "vue";
import path from "path";
import store from '@/store'

export default function () {
	const files = require.context("@/service/", true, /\.js$/);
	const ignore = ["./request.js"];

	let modules = {};

	files
		.keys()
		.filter((e) => !ignore.includes(e))
		.map((e) => {
			if (e.includes("--ignore")) {
				return false;
			}

			let list = e.substr(2).split("/");
			let parents = list.slice(0, list.length - 1);
			let name = path.basename(e, ".js");

			let curr = modules;
			let prev = null;
			let key = null;

			parents.forEach((k) => {
				if (!curr[k]) {
					curr[k] = {};
				}

				prev = curr;
				curr = curr[k];
				key = k;
			});

			let ep = files(e);

			if (ep.default) {
				let service = new ep.default();

				if (name == "index") {
					prev[key] = service;
				} else {
					curr[name] = service;
				}
			} else {
				console.error(`Service must export default [${e}]`);
			}
		});

	Vue.prototype.$service = store.$service = modules;
}
