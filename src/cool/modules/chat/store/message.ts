import { isArray } from "@/core/utils";

const state = {
	list: []
};

const getters = {
	messageList: (state: any) => state.list
};

const actions = {};

const mutations = {
	// 设置列表
	SET_MESSAGE_LIST(state: any, data: any[]) {
		state.list = data;
	},

	// 追加数据
	APPEND_MESSAGE_LIST(state: any, data: any) {
		state.list.push(data);
	},

	// 追加数据到头部
	PREPEND_MESSAGE_LIST(state: any, data: any) {
		const list = isArray(data) ? data : [data];
		state.list.unshift(...list.reverse());
	},

	// 清空列表
	CLEAR_MESSAGE_LIST(state: any) {
		state.list = [];
	},

	// 更新消息数据
	UPDATE_MESSAGE(state: any, { file, data, callback }: any) {
		let item = null;

		if (file) {
			item = state.list.find((e: any) => e.uid === file.uid);
		}

		if (item) {
			if (data) {
				Object.assign(item, data);
			}

			if (callback) callback(item);
		}
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};
