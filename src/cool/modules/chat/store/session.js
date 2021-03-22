import eventBus from "../utils/event-bus";
import { isBoolean } from "cl-admin/utils";

export default {
	state: {
		list: [],
		current: null,
		visible: true
	},

	getters: {
		// 当前会话
		session: state => state.current,
		// 会话列表
		sessionList: state => state.list,
		// 是否显示会话列表
		sessionVisible: state => state.visible
	},

	mutations: {
		// 设置会话信息
		SET_SESSION(state, data) {
			state.current = data;
			state.current.serviceUnreadCount = 0;
			eventBus.$emit("message.refresh", { page: 1 });
		},

		// 清空会话信息
		CLEAR_SESSION(state) {
			state.session = null;
		},

		// 更新会话信息
		UPDATE_SESSION(state, data) {
			Object.assign(state.current, data);
		},

		// 设置会话列表
		SET_SESSION_LIST(state, data) {
			state.list = data;
		},

		// 清空会话列表
		CLEAR_SESSION_LIST(state) {
			state.list = [];
		},

		// 打开会话列表
		OPEN_SESSION(state, val) {
			state.visible = isBoolean(val) ? val : !state.visible;
		},

		// 关闭会话列表
		CLOSE_SESSION(state) {
			state.visible = false;
		}
	}
};
