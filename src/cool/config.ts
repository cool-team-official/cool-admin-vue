import { getUrlParam, storage } from "./utils";

// 开发模式
const isDev: Boolean = import.meta.env.MODE === "development";

// Host
const host: String = "https://show.cool-admin.com";

// 请求地址
const baseUrl: String = (function () {
	let proxy = getUrlParam("proxy");

	if (proxy) {
		storage.set("proxy", proxy);
	} else {
		proxy = storage.get("proxy") || "pro";
	}

	return isDev ? `/${proxy}` : `/api`;
})();

// 应用配置
const app = {
	name: "COOL-ADMIN",

	// 菜单
	menu: {
		list: []
	},

	// 路由
	router: {
		// 模式
		mode: "history",
		// 页面
		pages: [],
		// 视图 / 路由下的 children
		views: []
	},

	// 主题
	theme: {
		// 主色
		color: "",
		// 样式地址
		url: ""
	},

	// 字体图标库
	iconfont: []
};

// 忽略规则
const ignore = {
	// 不显示请求进度条
	NProgress: ["/sys/info/record"],
	// 页面不需要登录验证
	token: ["/login", "/401", "/403", "/404", "/500", "/502"]
};

// 测试
const test = {
	token: "",
	mock: false,
	eps: true
};

export { isDev, host, baseUrl, app, ignore, test };
