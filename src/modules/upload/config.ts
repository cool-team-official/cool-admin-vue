export default () => {
	return {
		components: [
			import("./components/upload.vue"),
			import("./components/space.vue"),
			import("./components/panel.vue")
		],

		options: {
			// 尺寸
			size: 120,
			// 显示文案
			text: "选择文件",
			// 限制
			limit: {
				// 上传最大数量
				upload: 9,
				// 上传大小限制
				size: 100
			}
		},

		views: [
			{
				meta: {
					label: "图片空间"
				},
				path: "/upload/list",
				component: () => import("./views/list.vue")
			}
		]
	};
};
