import { iconfontUrl, app } from "@/config/env";
import { createLink } from "../utils";
import { colorPrimary } from "@/assets/css/common.scss";

// 主题初始化

if (app.theme) {
	const { url, color } = app.theme;

	if (url) {
		createLink(url, "theme-style");
	}

	document
		.getElementsByTagName("body")[0]
		.style.setProperty("--color-primary", color || colorPrimary);
}

// 字体图标库加载

if (iconfontUrl) {
	createLink(iconfontUrl);
}

// svg 图标加载

const req = require.context("@/icons/svg/", false, /\.svg$/);

req.keys().map(req);

function iconList() {
	return req
		.keys()
		.map(req)
		.map((e: any) => e.default.id)
		.filter(e => e.includes("icon"))
		.sort();
}

export { iconList };
