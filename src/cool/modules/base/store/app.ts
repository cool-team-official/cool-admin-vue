import store from "store";
import { deepMerge, getBrowser } from "@/core/utils";
import { app } from "@/config/env";

const browser = getBrowser();

const state = {
	info: {
		...app
	},
	browser,
	collapse: browser.isMini ? true : false
};

const getters = {
	// 应用配置
	app: (state: any) => state.info,
	// 浏览器信息
	browser: (state: any) => state.browser,
	// 左侧菜单是否收起
	menuCollapse: (state: any) => state.collapse
};

const actions = {
	appLoad({ getters, dispatch }: any) {
		if (getters.token) {
			// 读取菜单权限
			dispatch("permMenu");
			// 获取用户信息
			dispatch("userInfo");
		}
	}
};

const mutations = {
	// 设置浏览器信息
	SET_BROWSER(state: any) {
		state.browser = getBrowser();
	},

	// 收起左侧菜单
	COLLAPSE_MENU(state: any, val = false) {
		state.collapse = val;
	},

	// 更新应用配置
	UPDATE_APP(state: any, val: any) {
		deepMerge(state.info, val);
		store.set("__app__", state.info);
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};
