import { app } from "@/config/env";
import { deepMerge, getBrowser } from "cl-admin/utils";

export default {
	state: {
		info: {
			name: app.name
		},
		conf: {
			...app.conf
		},
		browser: {
			isMobile: false
		},
		collapse: false,
		upload: {
			mode: "local"
		}
	},
	getters: {
		// 应用信息
		appInfo: state => state.info,
		// 应用配置
		conf: state => state.conf,
		// 浏览器信息
		browser: state => state.browser,
		// 左侧菜单是否收起
		menuCollapse: state => state.collapse,
		// 上传配置
		upload: state => state.upload
	},
	actions: {
		appLoad({ getters, dispatch }) {
			if (getters.token) {
				// 读取菜单权限
				dispatch("permMenu");
				// 获取用户信息
				dispatch("userInfo");
				// 设置上传配置
				dispatch("setUpload");
			}
		},
		setUpload({ state }) {
			this.$service.common.uploadMode().then(res => {
				state.upload = res;
			});
		}
	},
	mutations: {
		// 设置浏览器信息
		SET_BROWSER(state) {
			state.browser = getBrowser();
		},

		// 收起左侧菜单
		COLLAPSE_MENU(state, val = false) {
			state.collapse = val;
		},

		// 更新应用配置
		UPDATE_CONF(state, val) {
			deepMerge(state.conf, val);
		}
	}
};
