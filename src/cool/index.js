import Crud from "cl-admin-crud";
import Theme from "cl-admin-theme";

export default {
	modules: [
		"base",
		{
			name: "upload",
			options: {
				icon: "el-icon-picture",
				text: "选择图片"
			}
		},
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
		},
		"chat",
		"task",
		"copy",
		"distpicker",
		"demo",
		{
			name: "theme",
			value: Theme
		}
	]
};
