import { isBoolean } from "@/core/utils";

const state = {
	list: [],
	current: null,
	visible: true
};

const getters = {
	// 当前会话
	session: (state: any) => state.current,
	// 会话列表
	sessionList: (state: any) => state.list,
	// 是否显示会话列表
	sessionVisible: (state: any) => state.visible
};

const actions = {};

const mutations = {
	// 设置会话信息
	SET_SESSION(state: any, data: any) {
		state.current = data;
		state.current.serviceUnreadCount = 0;
	},

	// 清空会话信息
	CLEAR_SESSION(state: any) {
		state.session = null;
	},

	// 更新会话信息
	UPDATE_SESSION(state: any, data: any) {
		Object.assign(state.current, data);
	},

	// 设置会话列表
	SET_SESSION_LIST(state: any, data: any[]) {
		state.list = data;
	},

	// 清空会话列表
	CLEAR_SESSION_LIST(state: any) {
		state.list = [];
	},

	// 打开会话列表
	OPEN_SESSION(state: any, val: any) {
		state.visible = isBoolean(val) ? val : !state.visible;
	},

	// 关闭会话列表
	CLOSE_SESSION(state: any) {
		state.visible = false;
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};
