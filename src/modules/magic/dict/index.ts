import { Merge } from "/@/cool";

export const Colors = [
	"#409EFF",
	"#67C23A",
	"#E6A23C",
	"#F56C6C",
	"#909399",
	"#B0CFEB",
	"#FF9B91",
	"#E6A23C",
	"#BFAD6F",
	"#FB78F2"
];

export const PropRules: {
	test?: any[];
	group?: string[];
	table?: Merge<
		DeepPartial<ClTable.Column>,
		{
			name?: string;
			props?: {
				[key: string]: any;
			};
		}
	>;
	form?: ClForm.Item;
	handler?: string;
}[] = [
	{
		group: ["province", "city", "district"],
		table: {
			label: "省市区",
			formatter(row) {
				return row.province + "-" + row.city + "-" + row.district;
			}
		},
		form: {
			label: "省市区",
			prop: "pca",
			hook: "pca",
			component: {
				name: "cl-distpicker"
			}
		}
	},
	{
		test: ["address", "addr"],
		table: {
			showOverflowTooltip: true
		},
		form: {
			name: "el-input",
			props: {
				type: "textarea",
				rows: 3
			}
		}
	},
	{
		test: ["createTime"],
		table: {
			sortable: "desc",
			width: 160
		}
	},
	{
		test: ["updateTime"],
		table: {
			sortable: "custom",
			width: 160
		}
	},
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
				type: "file",
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
				type: "file",
				multiple: true
			}
		}
	},
	{
		test: ["enable", "status", "isDefault"],
		table: {
			name: "cl-switch"
		},
		form: {
			name: "cl-switch"
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
		test: ["dates", "dateRange", "dateScope"],
		table: {
			name: "cl-date-text",
			props: {
				format: "YYYY-MM-DD"
			}
		},
		form: {
			name: "el-date-picker",
			props: {
				type: "daterange",
				valueFormat: "YYYY-MM-DD"
			}
		}
	},

	{
		test: ["times", "timeRange", "timeScope"],
		form: {
			name: "el-date-picker",
			props: {
				type: "datetimerange",
				valueFormat: "YYYY-MM-DD HH:mm:ss",
				defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]
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
		test: ["num", "price", "age", "amount", "stock"],
		form: {
			hook: {
				bind: ["number"]
			},
			component: {
				name: "el-input-number",
				props: {
					min: 0
				}
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
		test: ["rich", "text", "html", "content", "introduce"],
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
		test: ["date", "day"],
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
	}
];
