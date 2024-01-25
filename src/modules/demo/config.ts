import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		components: [() => import("./views/crud/components/code.vue")]
	};
};
