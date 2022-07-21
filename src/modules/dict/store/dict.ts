import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { isDev, useCool } from "/@/cool";

declare interface Data {
	[key: string]: Array<{ label: string; value: any }>;
}

export const useDictStore = defineStore("dict", () => {
	const { service } = useCool();

	// 对象数据
	const data = reactive<Data>({});

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
			.then((res) => {
				const d: any = {};

				for (const i in res) {
					d[i] = res[i].map((e: any) => {
						return {
							label: e.name,
							value: e.id
						};
					});
				}

				Object.assign(data, d);

				if (isDev) {
					console.log("字典数据", data);
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
