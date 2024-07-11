import { defineStore } from "pinia";
import { computed, reactive, toRaw } from "vue";
import { Dict } from "../types";
import { service } from "/@/cool";
import { deepTree } from "/@/cool/utils";
import { isDev } from "/@/config";
import { isArray } from "lodash-es";
import { deepFind, isEmpty } from "../utils";

const useDictStore = defineStore("dict", () => {
	// 对象数据
	const data = reactive<Dict.Data>({});

	// 获取
	function get(name: string) {
		return computed(() => data[name] || []);
	}

	// 查找
	function find(name: string, value: any | any[]) {
		const arr = isArray(value) ? value : [value];
		return arr.filter((e) => e !== undefined).map((v) => deepFind(v, get(name).value));
	}

	// 刷新
	async function refresh(types?: string[]) {
		return service.dict.info
			.data({
				types: types?.filter((e) => !isEmpty(e))
			})
			.then((res: Dict.Data) => {
				const d = {};

				for (const [i, arr] of Object.entries(res)) {
					arr.forEach((e) => {
						e.label = e.name;

						if (isEmpty(e.value)) {
							e.value = e.id;
						}
					});

					// @ts-ignore
					d[i] = deepTree(arr, "desc");
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
		find,
		refresh
	};
});

export { useDictStore };
