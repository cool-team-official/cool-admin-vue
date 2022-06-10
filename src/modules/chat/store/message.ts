import { defineStore } from "pinia";
import { ref } from "vue";
import { useCool } from "/@/cool";

export const useMessageStore = defineStore("chat-message", () => {
	const { service } = useCool();

	// 加载状态
	const loading = ref(false);

	// 列表
	const list = ref<any[]>([]);

	// 分页
	const pagination = ref();

	// 获取列表
	async function get(params?: any) {
		loading.value = true;

		// 发送请求
		await service.chat.message.page(params).then((res) => {
			list.value = res.list;
			pagination.value = res.pagination;
		});

		loading.value = false;
	}

	return {
		loading,
		list,
		pagination,
		get
	};
});
