import { iconfontUrl, app } from "@/config/env";
import { createLink } from "../utils";

if (app.theme) {
	if (app.theme.url) {
		createLink(app.theme.url);
	}
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
