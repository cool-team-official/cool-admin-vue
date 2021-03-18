import store from "@/store";
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

const req = require.context("@/icons/svg/", false, /\.svg$/);

req.keys().map(req);

export function iconList() {
	return req
		.keys()
		.map(req)
		.map(e => e.default.id)
		.filter(e => e.includes("icon"))
		.sort();
}

export const resize = () => {
	if (document.body.clientWidth < 1000) {
		store.commit("COLLAPSE_MENU", true);
		store.commit("UPDATE_APP", {
			conf: {
				showAMenu: false
			}
		});
	}

	store.commit("SET_BROWSER");
};

window.onload = () => {
	window.addEventListener("resize", resize);
	resize();
};
