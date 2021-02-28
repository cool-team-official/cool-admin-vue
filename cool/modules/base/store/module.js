export default {
	state: {
		info: {},
		list: [],
		views: []
	},

	getters: {
		// 模块信息
		modules: (state) => state.info,
		// 模块列表
		moduleList: (state) => state.list,
		// 模块视图
		moduleViews: (state) => state.moduleViews
	},

	mutations: {
		SET_MODULE(state, list) {
			let d = {};

			list.forEach((e) => {
				d[e.name] = e;
			});

			state.list = list;
			state.info = d;
		},

		SET_MODULE_VIEWS(state, list) {
			state.moduleViews = list;
		}
	}
};
