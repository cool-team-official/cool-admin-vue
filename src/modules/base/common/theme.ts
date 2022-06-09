import { config } from "/@/cool";
import { basename } from "/@/cool/utils";
import { createLink } from "../utils";

// 字体图标库加载
if (config.app.iconfont) {
	config.app.iconfont.forEach((e: string) => {
		createLink(e);
	});
}

// 默认
createLink("//at.alicdn.com/t/font_3254019_60a2xxj8uus.css");

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
