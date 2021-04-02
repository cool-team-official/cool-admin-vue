export default {
	modules: [
		// 基础模块
		"base",
		// 文件上传
		{
			name: "upload",
			options: {
				icon: "el-icon-picture",
				text: "选择图片"
			}
		},
		{
			name: "crud",
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
