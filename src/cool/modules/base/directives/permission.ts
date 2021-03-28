import store from "@/store";

function parse(value: any) {
	const permission = store.getters.permission;

	if (typeof value == "string") {
		return value ? permission.some((e: any) => e.includes(value.replace(/\s/g, ""))) : false;
	} else {
		return Boolean(value);
	}
}

function checkPerm(value: any) {
	if (!value) {
		return false;
	}

	if (Object.prototype.toString.call(value) === "[object Object]") {
		if (value.or) {
			return value.or.some(parse);
		}

		if (value.and) {
			return value.and.some((e: any) => !parse(e)) ? false : true;
		}
	}

	return parse(value);
}

function change(el: any, binding: any) {
	el.style.display = checkPerm(binding.value) ? el.getAttribute("_display") : "none";
}

export default {
	inserted(el: any, binding: any) {
		el.setAttribute("_display", el.style.display || "");

		change(el, binding);
	},
	update: change
};

export { checkPerm };
