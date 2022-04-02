import { getUrlParam } from "./utils";
import storage from "./utils/storage";

// 路由模式
export const routerMode: String = "history";

// 开发模式
export const isDev: Boolean = import.meta.env.MODE === "development";

// Host
export const host: String = "https://show.cool-admin.com";

// 请求地址
export const baseUrl: String = (function () {
	let proxy = getUrlParam("proxy");

	if (proxy) {
		storage.set("proxy", proxy);
	} else {
		proxy = storage.get("proxy") || "dev";
	}

	return isDev ? `/${proxy}` : `/api`;
})();

// 字体图标库
export const iconfont = [];

// 程序配置参数
export const app: any = {
	name: "COOL-ADMIN",

	// 自定义菜单列表
	menuList: [],

	// 主题
	theme: {
		// 主色
		color: "",
		// 样式地址
		url: ""
	}
};

// 忽略规则
export const ignore = {
	// 不显示请求进度条
	NProgress: ["/sys/info/record"],
	// 页面不需要登录验证
	token: ["/login", "/401", "/403", "/404", "/500", "/502"]
};

// 测试
export const test = {
	token: "",
	mock: false,
	eps: true
};
