import { last } from "lodash-es";
import { filename, extname } from "/@/cool/utils";
import { module } from "/@/cool";
import { Upload } from "../types";

// 模块参数
const { options } = module.get("upload");

// 规则列表
const rules: Upload.Rule[] = options.rules || [];

// 文件大小
export function fileSize(size = 0): string {
	const num = 1024.0;

	if (size < num) return size + "B";
	if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + "K";
	if (size < Math.pow(num, 3)) return (size / Math.pow(num, 2)).toFixed(2) + "M";
	if (size < Math.pow(num, 4)) return (size / Math.pow(num, 3)).toFixed(2) + "G";
	return (size / Math.pow(num, 4)).toFixed(2) + "T";
}

// 文件名
export function fileName(url: string) {
	return filename(url.substring(url.indexOf("_") + 1));
}

// 文件规则
export function fileRule(path?: string) {
	const d = rules.find((e) => {
		return e.exts.find((a) => a == extname(path || "").toLocaleLowerCase());
	});

	return (d || last(rules))!;
}

// 获取规则
export function getRule(type?: string) {
	return (rules.find((e) => e.type == type) || last(rules))!;
}

// 获取类型
export function getType(path: string) {
	return fileRule(path).type;
}

// 拼接数组下的url
export function getUrls(list: any[]) {
	return list.map((e) => e.url.replace(/,/g, encodeURIComponent(",")));
}

// 路径拼接
export function pathJoin(...parts: string[]): string {
	if (parts.length === 0) {
		return "";
	}

	const firstPart = parts[0];
	let isAbsolute = false;

	// 检查第一个部分是否以 "http" 开头，以确定路径类型（绝对还是相对）
	if (firstPart.startsWith("http")) {
		isAbsolute = true;
	}

	// 标准化路径，去除任何开头或结尾的斜杠
	const normalizedParts = parts.map((part) => part.replace(/(^\/+|\/+$)/g, ""));

	if (isAbsolute) {
		// 如果是绝对路径，使用斜杠连接部分
		return normalizedParts.join("/");
	} else {
		// 如果是相对路径，使用平台特定的分隔符连接部分
		return normalizedParts.join("/");
	}
}
