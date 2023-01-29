import { checkPerm } from "../common/permission";

function change(el: any, binding: any) {
	el.style.display = checkPerm(binding.value) ? el.getAttribute("_display") : "none";
}

export default {
	created(el: any, binding: any) {
		el.setAttribute("_display", el.style.display || "");
		change(el, binding);
	},
	updated: change
};
