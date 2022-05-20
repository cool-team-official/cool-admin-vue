import { onBeforeUpdate, ref, inject, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useService } from "../service";

export function useRefs() {
	const refs: any = ref<any[]>([]);

	onBeforeUpdate(() => {
		refs.value = [];
	});

	const setRefs = (index: string) => (el: any) => {
		refs.value[index] = el;
	};

	return { refs, setRefs };
}

// 服务
const service = useService();

// 组件命名
function named(name: string) {
	const { proxy }: any = getCurrentInstance();
	proxy.$.type.name = name;
}

export function useCool() {
	const { refs, setRefs } = useRefs();

	// 通信
	const mitt = inject<any>("mitt");

	// 路由
	const route = useRoute();

	// 路由器
	const router = useRouter();

	return {
		route,
		router,
		refs,
		setRefs,
		service,
		mitt,
		named
	};
}
