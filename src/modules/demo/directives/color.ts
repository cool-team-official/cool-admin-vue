export default {
	created(el: HTMLElement, binding: any) {
		el.style.color = binding.value;
	}
};
