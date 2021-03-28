import { ref, onBeforeUpdate, watch, reactive } from "vue";
import { isEmpty } from "../utils";

export function useForm(props: any) {
	const setFormData = () => {
		const data = reactive<any>(props.modelValue || {});

		watch(
			() => props.modelValue,
			(val: any) => {
				for (const i in data) {
					if (isEmpty(val[i])) {
						delete data[i];
					} else {
						data[i] = val[i];
					}
				}
			}
		);

		return data;
	};

	return {
		setFormData
	};
}

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
