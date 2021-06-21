// 参考官方例子 https://vuex.vuejs.org/zh/

export default {
	state: {
		count: 0
	},
	mutations: {
		increment(state: any) {
			state.count++;
		}
	},
	actions: {}
};
