import { last } from "lodash-es";
import { filename, extname } from "/@/cool/utils";

// 文件规则
const fileRules = [
	{
		label: "图片",
		value: "image",
		format: ["bmp", "jpg", "jpeg", "png", "tif", "gif", "svg", "webp"],
		color: "#67C23A"
	},
	{
		label: "视频",
		value: "video",
		format: ["avi", "wmv", "mpg", "mpeg", "mov", "rm", "ram", "swf", "flv", "mp4"],
		color: "#409EFF"
	},
	{
		label: "音频",
		value: "audio",
		format: ["mp3", "wav", "wma", "mp2", "flac", "midi", "ra", "ape", "aac", "cda"],
		color: "#E6A23C"
	},
	{
		label: "文件",
		value: "file",
		format: [],
		color: "#909399"
	}
];

// 文件大小
export function fileSize(size: number): string {
	if (!size) return "";

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

// 类型信息
export function fileType(path: string) {
	const d = fileRules.find((e) => {
		return e.format.find((a) => a == extname(path).toLocaleLowerCase());
	});

	return d || last(fileRules);
}

// 规则信息
export function fileRule(value: string) {
	return fileRules.find((e) => e.value == value);
}

// 拼接数组下的url
export function getUrls(list: any[]) {
	return list.map((e) => e.url.replace(/,/g, encodeURIComponent(","))).join(",");
}
