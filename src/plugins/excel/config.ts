import { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		components: [
			() => import("./components/import-btn.vue"),
			() => import("./components/export-btn")
		]
	};
};
