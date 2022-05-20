import Crud from "@cool-vue/crud";
import "@cool-vue/crud/dist/index.css";

export default [
	// crud 模块
	{
		name: "crud",
		value: Crud,
		options: {
			crud: {
				dict: {
					sort: {
						prop: "order",
						order: "sort"
					}
				}
			}
		}
	}
];
