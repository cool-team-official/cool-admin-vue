import fs from "fs";
import { join, sep } from "path";

// 首字母大写
export function firstUpperCase(value: string): string {
	return value.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
		return $1.toUpperCase() + $2;
	});
}

// 横杠转驼峰
export function toCamel(str: string): string {
	return str.replace(/([^-])(?:-+([^-]))/g, function ($0, $1, $2) {
		return $1 + $2.toUpperCase();
	});
}

// 创建目录
export function createDir(path: string) {
	if (!fs.existsSync(path)) fs.mkdirSync(path);
}

// 读取文件
export function readFile(name: string) {
	try {
		return fs.readFileSync(name, "utf8");
	} catch (e) {}

	return "";
}

// 解析body
export function parseJson(req: any): Promise<any> {
	return new Promise((resolve) => {
		let d = "";
		req.on("data", function (chunk: Buffer) {
			d += chunk;
		});
		req.on("end", function () {
			try {
				resolve(JSON.parse(d));
			} catch {
				resolve({});
			}
		});
	});
}

// 深度创建目录
export function mkdirs(path: string) {
	const arr = path.split(sep);
	let p = "";

	arr.forEach((e) => {
		try {
			fs.statSync(join(p, e));
		} catch (err) {
			try {
				fs.mkdirSync(join(p, e));
			} catch (error) {
				console.error(error);
			}
		}
		p = join(p, e);
	});

	return p;
}
