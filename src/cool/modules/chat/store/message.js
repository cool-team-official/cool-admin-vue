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
			const next = options => {
				state.list.push({
					...data,
					...options
				});
				eventBus.$emit("message.scrollToBottom");
			};

			// 图片预览、大小处理
			if (data.contentType === 1) {
				const image = new Image();

				image.onload = () => {
					let height = 0;
					let width = 0;

					if (image.width > 200) {
						width = 200;
						height = (image.height * 200) / image.width;
					}

					next({
						style: {
							height: height + "px",
							width: width + "px"
						}
					});
				};

				image.src = data.content.imageUrl;
			} else {
				next();
			}
		},

		// 追加数据到头部
		PREPEND_MESSAGE_LIST(state, data) {
			const list = isArray(data) ? data : [data];
			state.list.unshift(...list.reverse());
		},

		// 清空列表
		CLEAR_MESSAGE_LIST(state) {
			state.list = [];
		}
	}
};
