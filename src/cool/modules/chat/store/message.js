import { isArray } from "cl-admin/utils";
import eventBus from "../utils/event-bus";

export default {
	state: {
		list: []
	},

	getters: {
		messageList: state => state.list
	},

	mutations: {
		// 设置列表
		SET_MESSAGE_LIST(state, data) {
			state.list = data;
		},

		// 追加数据
		APPEND_MESSAGE_LIST(state, data) {
			state.list.push(data);
			eventBus.$emit("message.scrollToBottom");
		},

		// 追加数据到头部
		PREPEND_MESSAGE_LIST(state, data) {
			const list = isArray(data) ? data : [data];
			state.list.unshift(...list.reverse());
		},

		// 清空列表
		CLEAR_MESSAGE_LIST(state) {
			state.list = [];
		},

		// 更新消息数据
		UPDATE_MESSAGE(state, { file, data, callback }) {
			let item = null;

			if (file) {
				item = state.list.find(e => e.uid === file.uid);
			}

			if (item) {
				if (data) {
					Object.assign(item, data);
				}

				if (callback) callback(item);
			}
		}
	}
};
