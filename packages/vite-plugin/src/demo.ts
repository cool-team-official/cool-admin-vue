import type { Plugin } from "vite";
import { glob } from "glob";
import path from "path";
import { readFileSync } from "fs";
import { rootDir } from "./utils";

export function demo(enable?: boolean): Plugin {
	const virtualModuleIds = ["virtual:demo"];

	return {
		name: "vite-cool-demo",
		enforce: "pre",
		resolveId(id) {
			if (virtualModuleIds.includes(id)) {
				return "\0" + id;
			}
		},
		async load(id) {
			if (id === "\0virtual:demo") {
				const demo: any = {};

				if (enable) {
					const files = await glob(
						rootDir("./src/modules/demo/views/crud/components") + "/**",
						{
							stat: true,
							withFileTypes: true,
						},
					);

					for (const file of files) {
						if (file.isFile()) {
							const p = path.join(file.path, file.name);

							demo[
								p
									.replace(/\\/g, "/")
									.split("src/modules/demo/views/crud/components/")[1]
							] = readFileSync(p, "utf-8");
						}
					}
				}

				return `
					export const demo = ${JSON.stringify(demo)};
				`;
			}
		},
	};
}
