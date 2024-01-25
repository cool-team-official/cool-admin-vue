import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		components: [() => import("./components/group.vue"), () => import("./components/head.vue")]
	};
};
