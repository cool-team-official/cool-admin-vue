import { Emitter } from "mitt";
import { onBeforeUpdate, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useService } from "../service";

const service = useService();

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
	return {
		service,
		route: useRoute(),
		router: useRouter(),
		mitt: inject("mitt") as Emitter<any>,
		...useRefs()
	};
}
