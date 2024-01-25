import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		components: [() => import("./components/preview.vue")]
	};
};
