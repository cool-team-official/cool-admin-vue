import { iconfontUrl, app } from "@/config/env";
import { createLink } from "../utils";
import { colorPrimary } from "@/assets/css/common.scss";

if (app.theme) {
	const { url, color } = app.theme;

	if (url) {
		createLink(url, "theme-style");
	}

	document
		.getElementsByTagName("body")[0]
		.style.setProperty("--color-primary", color || colorPrimary);
}

if (iconfontUrl) {
	createLink(iconfontUrl);
}

const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context("@/icons/svg/", false, /\.svg$/);
requireAll(req);

export function iconList() {
	return req
		.keys()
		.map(req)
		.map(e => e.default.id)
		.filter(e => e.includes("icon"))
		.sort();
}
