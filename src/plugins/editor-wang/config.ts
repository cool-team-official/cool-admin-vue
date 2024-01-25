import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		components: [() => import("./components/wang.vue")]
	};
};
