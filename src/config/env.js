import store from "store";
import { getUrlParam } from "cl-admin/utils";

// 路由模式
const routerMode = "history";

// 开发模式
const isDev = process.env.NODE_ENV == "development";

// Host
const host = "https://show.cool-admin.com";

// 请求地址
const baseUrl = (function () {
	let proxy = getUrlParam("proxy");

	if (proxy) {
		store.set("proxy", proxy);
	} else {
		proxy = store.get("proxy") || "dev";
	}

	switch (process.env.NODE_ENV) {
		case "development":
			return `/${proxy}/admin`;
		case "production":
			return `/api/admin`;
		default:
			return "";
	}
})();

// Socket
const socketUrl = (isDev ? `${host}` : "") + "/socket";

// 阿里字体图标库 https://at.alicdn.com/t/**.css
const iconfontUrl = ``;

// 程序配置参数
const app = {
	name: "cool-admin",

	conf: {
		// 是否显示一级菜单栏
		showAMenu: false,
		// 是否显示路由导航栏
		showRouteNav: true,
		// 是否显示页面进程栏
		showProcess: true,
		// 自定义菜单
		customMenu: false
	}
};

// 自定义菜单列表
const menuList = [];

export { routerMode, baseUrl, socketUrl, iconfontUrl, app, isDev, menuList };
