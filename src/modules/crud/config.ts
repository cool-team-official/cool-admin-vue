import { Merge, ModuleConfig } from "/@/cool";

// npm
import Crud, { locale } from "@cool-vue/crud";
import "@cool-vue/crud/dist/index.css";

// 调试、自定义crud
// import Crud, { locale } from "../../../packages/crud/src";
// import "../../../packages/crud/src/static/index.scss";

export default (): Merge<ModuleConfig, CrudOptions> => {
	return {
		options: {
			dict: {
				sort: {
					prop: "order",
					order: "sort"
				},
				label: locale.zhCn
			},
			render: {
				functionSlots: {
					exclude: ["el-date-picker", "el-cascader", "el-time-select", "el-transfer"]
				}
			}
		},
		install: Crud.install
	};
};
