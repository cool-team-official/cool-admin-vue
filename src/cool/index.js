import Crud from "cl-admin-crud";
import Theme from "cl-admin-theme";

export default {
	modules: [
		"base",
		"task",
		{
			name: "upload",
			options: {
				icon: "el-icon-picture",
				text: "选择图片",
				limitSize: 1,
				rename: true
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
		"copy",
		"distpicker",
		"demo",
		{
			name: "theme",
			value: Theme
		}
	]
};
