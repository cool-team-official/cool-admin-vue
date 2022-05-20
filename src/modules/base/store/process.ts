import { defineStore } from "pinia";
import { ref } from "vue";

interface Item {
	label: string;
	value: string;
	active?: boolean;
	keepAlive?: boolean;
}

export const useProcessStore = defineStore("process", function () {
	const menu1: Item = {
		label: "首页",
		value: "/",
		active: true
	};

	const list = ref<Item[]>([menu1]);

	// 添加
	function add(item: Item) {
		const index = list.value.findIndex(
			(e: Item) => e.value.split("?")[0] === item.value.split("?")[0]
		);

		list.value.map((e: Item) => {
			e.active = e.value == item.value;
		});

		if (index < 0) {
			if (item.value == "/") {
				item.label = menu1.label;
			}

			if (item.label) {
				list.value.push({
					...item,
					active: true
				});
			}
		} else {
			list.value[index].active = true;
			list.value[index].label = item.label;
			list.value[index].value = item.value;
		}
	}

	// 移除
	function remove(index: number) {
		if (index != 0) {
			list.value.splice(index, 1);
		}
	}

	// 设置
	function set(data: Item[]) {
		list.value = data;
	}

	// 重置
	function reset() {
		list.value = [menu1];
	}

	return {
		list,
		add,
		remove,
		set,
		reset
	};
});
