export default [
	{
		moduleName: "crud",
		label: "crud 示例",
		path: "/crud",
		component: () => import("./crud")
	},
	{
		moduleName: "editor-quill",
		label: "quill 富文本编辑器",
		path: "/editor-quill",
		component: () => import("./editor-quill")
	},
	{
		moduleName: "upload",
		label: "文件上传",
		path: "/upload",
		component: () => import("./upload")
	},
	{
		moduleName: "demo",
		label: "组件预览",
		path: "/demo",
		component: () => import("./demo")
	}
];
