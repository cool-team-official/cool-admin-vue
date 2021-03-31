import { iconfontUrl, app } from "/@/config/env";
import { basename } from "/@/core/utils";
import { createLink } from "../utils";

// 主题初始化

if (app.theme) {
	const { url, color } = app.theme;

	if (url) {
		createLink(url, "theme-style");
	}

	document.getElementsByTagName("body")[0].style.setProperty("--color-primary", color);
}

// 字体图标库加载

if (iconfontUrl) {
	createLink(iconfontUrl);
}

// svg 图标加载

const svgFiles = import.meta.globEager("/src/icons/svg/**/*.svg");

function iconList() {
	const list: string[] = [];

	for (const i in svgFiles) {
		list.push(basename(i).replace(".svg", ""));
	}

	return list;
}

export { iconList };
