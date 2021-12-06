export default [
	{
		test: ["avatar", "img", "image", "pic", "photo", "picture", "head", "icon"],
		table: {
			name: "cl-image",
			props: {
				size: 60
			}
		},
		form: {
			name: "cl-upload"
		}
	},
	{
		test: ["avatars", "imgs", "images", "pics", "photos", "pictures", "heads", "icons"],
		table: {
			name: "cl-image",
			props: {
				size: 60
			}
		},
		form: {
			name: "cl-upload",
			props: {
				listType: "picture-card",
				multiple: true
			}
		}
	},
	{
		test: ["file", "attachment", "attach", "url", "video", "music"],
		table: {
			name: "cl-link"
		},
		form: {
			name: "cl-upload",
			props: {
				listType: "text",
				limit: 1
			}
		}
	},
	{
		test: ["files", "attachments", "attachs", "urls", "videos", "musics"],
		table: {
			name: "cl-link"
		},
		form: {
			name: "cl-upload",
			props: {
				listType: "text",
				multiple: true
			}
		}
	},
	{
		test: ["enable", "status"],
		table: {
			name: "cl-switch"
		},
		form: {
			name: "el-switch"
		}
	},
	{
		test: ["type", "classify", "category"],
		handler: "dict"
	},
	{
		test: ["types", "classifys", "categorys"],
		handler: "dict_multiple"
	},
	{
		test: ["date"],
		form: {
			name: "el-date-picker",
			props: {
				type: "date"
			}
		}
	},
	{
		test: ["dates", "dateRange", "dateScope"],
		form: {
			name: "el-date-picker",
			props: {
				type: "daterange"
			}
		}
	},
	{
		test: ["time"],
		form: {
			name: "el-date-picker",
			props: {
				type: "datetime"
			}
		}
	},
	{
		test: ["times", "timeRange", "timeScope"],
		form: {
			name: "el-date-picker",
			props: {
				type: "datetimerange"
			}
		}
	},
	{
		test: ["star", "stars"],
		table: {
			name: "el-rate",
			props: {
				disabled: true
			}
		},
		form: {
			name: "el-rate"
		}
	},
	{
		test: ["progress", "rate", "ratio"],
		table: {
			name: "el-progress"
		},
		form: {
			name: "el-slider",
			props: {
				style: {
					width: "200px"
				}
			}
		}
	},
	{
		test: ["num", "price", "age", "amount"],
		form: {
			name: "el-input-number",
			props: {
				min: 0
			}
		}
	},
	{
		test: ["remark", "desc"],
		table: {
			showOverflowTooltip: true
		},
		form: {
			name: "el-input",
			props: {
				type: "textarea",
				rows: 4
			}
		}
	},
	{
		test: ["rich", "text", "html", "content"],
		form: {
			name: "cl-editor-quill",
			props: {
				height: 400
			}
		}
	},
	{
		test: ["code", "codes"],
		form: {
			name: "cl-codemirror",
			props: {
				height: 400
			}
		}
	},
	{
		test: ["createTime"],
		table: {
			sortable: "desc"
		}
	},
	{
		test: ["updateTime"],
		table: {
			sortable: "custom"
		}
	}
];
