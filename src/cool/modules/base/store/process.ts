const fMenu = {
	label: "首页",
	value: "/",
	active: true
};

const state = {
	list: [fMenu]
};

const getters = {
	// 页面进程列表
	processList: (state: any) => state.list
};

const actions = {};

const mutations = {
	ADD_PROCESS(state: any, item: any) {
		const index = state.list.findIndex(
			(e: any) => e.value.split("?")[0] === item.value.split("?")[0]
		);

		state.list.map((e: any) => {
			e.active = e.value == item.value;
		});

		if (index < 0) {
			if (item.value == "/") {
				item.label = fMenu.label;
			}

			if (item.label) {
				state.list.push({
					...item,
					active: true
				});
			}
		} else {
			state.list[index].active = true;
			state.list[index].label = item.label;
			state.list[index].value = item.value;
		}
	},

	DEL_PROCESS(state: any, index: number) {
		if (index != 0) {
			state.list.splice(index, 1);
		}
	},

	SET_PROCESS(state: any, list: Array<any>) {
		state.list = list;
	},

	RESET_PROCESS(state: any) {
		state.list = [fMenu];
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};
