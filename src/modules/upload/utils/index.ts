import { filename, extname } from "/@/cool/utils";

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

// 文件类型
export function fileType(path: string) {
	const fs = [
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
		}
	];

	return (
		fs.find((e) => {
			return e.format.find((a) => a == extname(path).toLocaleLowerCase());
		}) || {
			label: "文件",
			value: "file",
			color: "#909399"
		}
	);
}
