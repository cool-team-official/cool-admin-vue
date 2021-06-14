import Crud from "cl-admin-crud-vue3";
import "cl-admin-crud-vue3/dist/index.css";

export default {
	modules: [
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
	]
};
