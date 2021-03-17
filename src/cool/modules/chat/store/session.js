import eventBus from "../utils/event-bus";

export default {
	state: {
		list: [],
		current: null
	},

	getters: {
		// 当前会话
		session: state => state.current,
		// 会话列表
		sessionList: state => state.list
	},

	mutations: {
		// 设置会话信息
		SET_SESSION(state, data) {
			state.current = data;
			state.current.serviceUnreadCount = 0;
			eventBus.$emit("message-refresh", { page: 1 });
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
		}
	}
};
