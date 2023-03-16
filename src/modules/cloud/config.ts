import { ModuleConfig } from "/@/cool";
import { addDeclare } from "/$/extend";
import { CodeDeclare } from "./dict";

export default (): ModuleConfig => {
	return {
		views: [
			{
				path: "/cloud/func/dev",
				meta: {
					label: "云函数开发"
				},
				component: () => import("./views/func/dev.vue")
			}
		],

		onLoad() {
			addDeclare(CodeDeclare);
		}
	};
};
