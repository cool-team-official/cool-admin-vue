import { defineStore } from "pinia";
import { ref } from "vue";
import { config } from "/@/cool";
import { deepMerge, getBrowser, storage } from "/@/cool/utils";

export const useAppStore = defineStore("app", function () {
	// 基本信息
	const info = ref<any>({
		...config.app
	});

	// 浏览器信息
	const browser = ref<any>(getBrowser());

	// 加载
	const loading = ref<boolean>(false);

	// 是否折叠
	const isFold = ref<boolean>(browser.value.isMini || false);

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

	// 加载
	function showLoading() {
		loading.value = true;
	}

	// 关闭
	function hideLoading() {
		loading.value = false;
	}

	return {
		info,
		browser,
		loading,
		isFold,
		fold,
		set,
		setBrowser,
		showLoading,
		hideLoading
	};
});
