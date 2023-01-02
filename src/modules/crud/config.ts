import { Merge, ModuleConfig } from "/@/cool";
import Crud from "@cool-vue/crud";
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
