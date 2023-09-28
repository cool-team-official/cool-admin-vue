import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { merge } from "lodash-es";
import { useBrowser } from "/@/cool";
import { storage } from "/@/cool/utils";
import { config } from "/@/config";

export const useAppStore = defineStore("app", function () {
	const { browser, onScreenChange } = useBrowser();

	// 基本信息
	const info = reactive({
		...config.app
	});

	// 是否折叠
	const isFold = ref(false);

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
		merge(info, data);
		storage.set("__app__", info);
	}

	// 添加事件
	function addEvent(name: string, func: any) {
		if (func) {
			events[name].push(func);
		}
	}

	// 监听屏幕变化
	onScreenChange(() => {
		isFold.value = browser.isMini;
	});

	return {
		info,
		isFold,
		fold,
		events,
		set,
		addEvent
	};
});
