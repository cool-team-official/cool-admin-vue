import { onBeforeUpdate, ref, inject, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

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

export function useCool() {
	const { refs, setRefs } = useRefs();
	const service = inject<any>("service");
	const mitt = inject<any>("mitt");
	const store = useStore();
	const route = useRoute();
	const router = useRouter();
	const app = computed(() => store.getters.app);

	return {
		store,
		route,
		router,
		refs,
		setRefs,
		service,
		mitt,
		app
	};
}

export function useModule() {
	const store = useStore();
	const moduleList = computed(() => store.getters.moduleList);
	const modules = computed(() => store.getters.modules);

	return {
		moduleList,
		modules
	};
}
