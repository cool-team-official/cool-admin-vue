import { onBeforeUpdate, ref } from "vue";

export function useRefs() {
	const refs = ref<HTMLElement[]>([]);

	onBeforeUpdate(() => {
		refs.value = [];
	});

	const setRefs = (index: number) => (el: HTMLElement) => {
		refs.value[index] = el;
	};

	return { refs, setRefs };
}
