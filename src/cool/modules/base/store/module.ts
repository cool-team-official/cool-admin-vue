const state = {
	info: {},
	list: []
};

const getters = {
	// 模块信息
	modules: (state: any) => state.info,
	// 模块列表
	moduleList: (state: any) => state.list
};

const mutations = {
	SET_MODULE(state: any, list: Array<any>) {
		const d: any = {};

		list.forEach((e: any) => {
			d[e.name] = e;
		});

		state.list = list;
		state.info = d;
	}
};

export default {
	state,
	getters,
	mutations
};
