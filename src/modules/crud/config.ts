import { Merge, ModuleConfig } from "/@/cool";
import Crud from "@cool-vue/crud";
// 调试或者自定义crud
// import Crud from "../../../packages/crud/src";
import "@cool-vue/crud/dist/index.css";

export default (): Merge<ModuleConfig, CrudOptions> => {
	return {
		options: {
			dict: {
				sort: {
					prop: "order",
					order: "sort"
				}
			}
		},
		install: Crud.install
	};
};
