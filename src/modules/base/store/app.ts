import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { config } from "/@/cool";
import { deepMerge, getBrowser, storage } from "/@/cool/utils";

export const useAppStore = defineStore("app", function () {
	// 基本信息
	const info = reactive({
		...config.app
	});

	// 浏览器信息
	const browser = ref<any>(getBrowser());

	// 是否折叠
	const isFold = ref(browser.value.isMini || false);

	// 事件
	const events = reactive<{ [key: string]: any[] }>({
		hasToken: []
	});

	// 折叠
	function fold(v?: boolean) {
		if (v === undefined) {
			v = !isFold.value;
		}

		isFold.value = v;
	}

	// 设置基本信息
	function set(data: any) {
		deepMerge(info, data);
		storage.set("__app__", info);
	}

	// 设置浏览器信息
	function setBrowser() {
		browser.value = getBrowser();
	}

	// 添加事件
	function addEvent(name: string, func: any) {
		if (func) {
			events[name].push(func);
		}
	}

	return {
		info,
		browser,
		isFold,
		fold,
		events,
		set,
		setBrowser,
		addEvent
	};
});
