import { iconfontUrl } from "@/config/env";

if (iconfontUrl) {
	const link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = iconfontUrl;
	document.getElementsByTagName("head")[0].appendChild(link);
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
