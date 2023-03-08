import { createWriteStream } from "fs";
import prettier from "prettier";
import { join } from "path";
import { mkdirs } from "../../utils";

// 创建文件
export async function createMenu(options: { viewPath: string; code: string }) {
	// 格式化内容
	const content = prettier.format(options.code, {
		parser: "vue",
		useTabs: true,
		tabWidth: 4,
		endOfLine: "lf",
		semi: true,
		jsxBracketSameLine: true,
		singleQuote: false,
		printWidth: 100,
		trailingComma: "none"
	});

	// 目录路径
	const dir = (options.viewPath || "").split("/");

	// 文件名
	const fname = dir.pop();

	// 创建目录
	const path = mkdirs(`./src/${dir.join("/")}`);

	// 创建文件
	createWriteStream(join(path, fname || "demo"), {
		flags: "w"
	}).write(content);
}
