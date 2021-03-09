import Crud from "cl-admin-crud";
import Export from "cl-admin-export";

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
		{
			name: "export",
			value: Export
		},
		"copy",
		"distpicker",
		"demo",
		"theme"
	]
};
