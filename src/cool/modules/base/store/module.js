export default {
	state: {
		info: {},
		list: []
	},

	getters: {
		// 模块信息
		modules: state => state.info,
		// 模块列表
		moduleList: state => state.list
	},

	mutations: {
		SET_MODULE(state, list) {
			let d = {};

			list.forEach(e => {
				d[e.name] = e;
			});

			state.list = list;
			state.info = d;
		}
	}
};
