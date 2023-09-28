import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		toolbar: {
			order: 2,
			h5: false,
			component: import("./components/index.vue")
		},
		options: {
			// socket.io 连接地址
			path: "/chat"
		}
	};
};
