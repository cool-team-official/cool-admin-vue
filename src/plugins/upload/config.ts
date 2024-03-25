import type { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		label: "文件上传",
		description: "基于 el-upload 封装的文件上传组件",
		author: "COOL",
		version: "1.2.2",
		updateTime: "2024-03-25",
		demo: [
			{
				name: "基础用法",
				component: () => import("./demo/base.vue")
			},
			{
				name: "多图上传",
				component: () => import("./demo/multiple.vue")
			},
			{
				name: "小图模式",
				component: () => import("./demo/small.vue")
			},
			{
				name: "文件上传",
				component: () => import("./demo/file.vue")
			},
			{
				name: "可拖拽",
				component: () => import("./demo/drag.vue")
			},
			{
				name: "自定义内容",
				component: () => import("./demo/custom.vue")
			},
			{
				name: "上传校验",
				component: () => import("./demo/check.vue")
			},
			{
				name: "文件空间",
				component: () => import("./demo/space.vue")
			}
		],

		// 参数
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
			// 云端上传路径前缀
			prefixPath: "app/base",
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
			() => import("./components/upload.vue"),
			() => import("./components/upload-item/index.vue")
		]
	};
};
