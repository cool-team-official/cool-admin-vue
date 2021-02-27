export default {
	state: {
		info: {},
		list: [],
		modules: []
	},

	getters: {
		// 组件信息
		components: (state) => state.info,
		// 组件列表
		componentList: (state) => state.list,
		// 组件模块
		componentModules: (state) => state.modules
	},

	mutations: {
		SET_COMPONENT(state, list) {
			let d = {};

			list.forEach((e) => {
				d[e.name] = e;
			});

			state.list = list;
			state.info = d;
		},

		SET_COMPONENT_MODULES(state, list) {
			state.modules = list;
		}
	}
};
