import { defineStore } from "pinia";
import { computed, reactive, toRaw } from "vue";
import { Dict } from "../types";
import { isDev, service } from "/@/cool";
import { deepTree } from "/@/cool/utils";

const useDictStore = defineStore("dict", () => {
	// 对象数据
	const data = reactive<Dict.Data>({});

	// 获取
	function get(name: string) {
		return computed(() => data[name]);
	}

	// 刷新
	async function refresh(types?: string[]) {
		return service.dict.info
			.data({
				types
			})
			.then((res: Dict.Data) => {
				const d: Dict.Data = {};

				for (const i in res) {
					d[i] = deepTree(
						res[i].map((e) => {
							return {
								...e,
								label: e.name,
								value: e.id
							};
						}),
						"desc"
					);
				}

				Object.assign(data, d);

				if (isDev) {
					console.group("字典数据");
					console.log(toRaw(data));
					console.groupEnd();
				}

				return data;
			});
	}

	return {
		data,
		get,
		refresh
	};
});

export { useDictStore };
