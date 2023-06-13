import { Merge, ModuleConfig } from "/@/cool";

// npm
import Crud from "@cool-vue/crud";
import "@cool-vue/crud/dist/index.css";

// 调试、自定义crud
// import Crud from "../../../packages/crud/src";
// import "../../../packages/crud/src/static/index.scss";

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
