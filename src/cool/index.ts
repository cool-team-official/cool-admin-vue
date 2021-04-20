import Crud from "cl-admin-crud-vue3";
import "cl-admin-crud-vue3/dist/index.css";

export default {
	modules: [
		// 基础模块
		"base",
		// 文件上传
		{
			name: "upload",
			options: {
				icon: "el-icon-picture",
				text: ""
			}
		},
		// Excel 导出模块
		"excel-export",
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
		},
		// 客服聊天
		"chat",
		// 任务管理
		"task",
		// 复制指令
		"copy",
		// 示例页
		"demo",
		// 主题切换
		"theme"
	]
};
