import { filename } from "/@/cool/utils";

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
