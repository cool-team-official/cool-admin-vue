import { Merge, ModuleConfig } from "/@/cool";

// npm
// import Crud, { locale } from "@cool-vue/crud";
// import "@cool-vue/crud/dist/index.css";

// 调试、自定义crud
import Crud, { locale } from "../../../packages/crud/src";
import "../../../packages/crud/src/static/index.scss";

export default (): Merge<ModuleConfig, CrudOptions> => {
	return {
		// 组件全注册
		components: Object.values(import.meta.glob("./components/**/*.{vue,tsx}")),

		// 配置参数，具体配置点 CrudOptions 查看
		options: {
			style: {
				table: {
					// contextMenu: [], 是否关闭表格右键菜单
				}
			},
			dict: {
				// 排序字段
				sort: {
					prop: "order",
					order: "sort"
				},
				// 按钮及提示文案
				label: locale.zhCn
			},
			render: {
				functionSlots: {
					exclude: ["el-date-picker", "el-cascader", "el-time-select", "el-transfer"]
				}
			}
		},

		// 安装
		install: Crud.install
	};
};
