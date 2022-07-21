import { defineStore } from "pinia";
import { ref } from "vue";
import { config } from "/@/cool";
import { deepMerge, getBrowser, storage } from "/@/cool/utils";

export const useAppStore = defineStore("app", function () {
	// 请求状态
	const req = ref();

	// 基本信息
	const info = ref<any>({
		...config.app
	});

	// 浏览器信息
	const browser = ref<any>(getBrowser());

	// 是否折叠
	const isFold = ref(browser.value.isMini || false);

	// 折叠
	function fold(v?: boolean) {
		if (v === undefined) {
			v = !isFold.value;
		}

		isFold.value = v;
	}

	// 设置基本信息
	function set(data: any) {
		deepMerge(info.value, data);
		storage.set("__app__", info.value);
	}

	// 设置浏览器信息
	function setBrowser() {
		browser.value = getBrowser();
	}

	return {
		req,
		info,
		browser,
		isFold,
		fold,
		set,
		setBrowser
	};
});
