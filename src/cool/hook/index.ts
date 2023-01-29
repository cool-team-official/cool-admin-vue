import { Emitter } from "mitt";
import { inject, getCurrentInstance, Ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { service } from "../service";
import { Data } from "../utils";
import { useBrowser } from "./browser";

export function useService(): Eps.Service {
	return Data.get("service" || service);
}

export function useRefs() {
	const refs = reactive<{ [key: string]: any }>({});
	function setRefs(name: string) {
		return (el: any) => {
			refs[name] = el;
		};
	}

	return { refs, setRefs };
}

export function useParent(name: string, r: Ref) {
	const d = getCurrentInstance();

	if (d) {
		let parent = d.proxy?.$.parent;

		if (parent) {
			while (parent && parent.type?.name != name && parent.type?.name != "cl-crud") {
				parent = parent?.parent;
			}

			if (parent) {
				if (parent.type.name == name) {
					r.value = parent.proxy;
				}
			}
		}
	}

	return r;
}

export function useCool() {
	return {
		service: useService(),
		route: useRoute(),
		router: useRouter(),
		mitt: inject("mitt") as Emitter<any>,
		...useBrowser(),
		...useRefs()
	};
}

export * from "./browser";
