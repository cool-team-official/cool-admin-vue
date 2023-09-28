export default () => {
	return {
		options: {
			// 尺寸
			size: 120,
			// 限制
			limit: {
				// 上传最大数量
				upload: 9,
				// 上传大小限制
				size: 100
			},
			// 规则
			rules: [
				{
					name: "图片",
					type: "image",
					color: "#67C23A",
					exts: ["bmp", "jpg", "jpeg", "png", "tif", "gif", "svg", "webp"]
				},
				{
					name: "视频",
					type: "video",
					color: "#826aec",
					exts: ["avi", "wmv", "mpg", "mpeg", "mov", "rm", "ram", "swf", "flv", "mp4"]
				},
				{
					name: "音频",
					type: "audio",
					color: "#826aec",
					exts: ["mp3", "wav", "wma", "mp2", "flac", "midi", "ra", "ape", "aac", "cda"]
				},
				{
					name: "文档",
					type: "word",
					color: "#53B7F4",
					exts: ["doc", "dot", "wps", "wpt", "docx", "dotx", "docm", "dotm"]
				},
				{
					name: "表格",
					type: "excel",
					color: "#53D39C",
					exts: ["xls", "xlt", "et", "xlsx", "xltx", "xlsm", "xltm"]
				},
				{
					name: "演示",
					type: "ppt",
					color: "#F56C6C",
					exts: [
						"ppt",
						"pptx",
						"pptm",
						"ppsx",
						"ppsm",
						"pps",
						"potx",
						"potm",
						"dpt",
						"dps"
					]
				},
				{
					name: "PDF",
					type: "pdf",
					exts: ["pdf"],
					color: "#8f3500"
				},
				{
					name: "压缩文件夹",
					type: "rar",
					color: "#FFC757",
					exts: ["rar", "zip"]
				},
				{
					name: "文件",
					type: "file",
					color: "#909399",
					exts: []
				}
			]
		},

		components: [
			import("./components/upload.vue"),
			import("./components/upload-item/index.vue"),
			import("./components/space.vue"),
			import("./components/space-inner.vue")
		],

		views: [
			{
				meta: {
					label: "文件空间"
				},
				path: "/upload/list",
				component: () => import("./views/list.vue")
			}
		]
	};
};
