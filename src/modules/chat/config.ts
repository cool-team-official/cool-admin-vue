import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		options: {
			// socket.io 连接地址
			path: "/chat"
		},
		components: [import("./components/index.vue")]
	};
};
