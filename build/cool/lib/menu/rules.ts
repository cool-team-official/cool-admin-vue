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
		table: {
			name: "cl-date-text",
			props: {
				format: "YYYY-MM-DD"
			}
		},
		form: {
			name: "el-date-picker",
			props: {
				type: "date",
				valueFormat: "YYYY-MM-DD"
			}
		}
	},
	{
		test: ["dates", "dateRange", "dateScope"],
		table: {
			name: "cl-date-text",
			props: {
				format: "YYYY-MM-DD"
			}
		},
		form: {
			component: {
				name: "el-date-picker",
				props: {
					type: "daterange",
					valueFormat: "YYYY-MM-DD"
				}
			}
		}
	},
	{
		test: ["time"],
		form: {
			name: "el-date-picker",
			props: {
				type: "datetime",
				valueFormat: "YYYY-MM-DD HH:mm:ss"
			}
		}
	},
	{
		test: ["times", "timeRange", "timeScope"],
		form: {
			component: {
				name: "el-date-picker",
				props: {
					type: "datetimerange",
					valueFormat: "YYYY-MM-DD HH:mm:ss",
					defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]
				}
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
		test: ["rich", "text", "html", "content", "introduce", "description", "desc"],
		form: {
			name: "cl-editor-wang"
		}
	},
	{
		test: ["code", "codes"],
		form: {
			name: "cl-editor-monaco"
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
