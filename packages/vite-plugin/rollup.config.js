import typescript from "@rollup/plugin-typescript";

import { defineConfig } from "rollup";

export default defineConfig({
	input: ["src/index.ts"],

	external: ["lodash"],

	output: {
		name: "index",
		format: "umd",
		file: "dist/index.js",
	},

	plugins: [
		typescript({
			module: "esnext",
			exclude: ["./node_modules/**"],
		}),
	],
});
