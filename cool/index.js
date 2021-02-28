import Base from "./modules/base";
import Upload from "./modules/upload";
import Copy from "./modules/copy";
import Demo from "./modules/demo";
import Distpicker from "./modules/distpicker";
import Crud from "cl-admin-crud";
import Export from "cl-admin-export";

export default {
	modules: [
		["base", Base],
		[
			"upload",
			Upload,
			{
				icon: "el-icon-picture",
				text: "选择图片",
				limitSize: 1,
				rename: true
			}
		],
		[
			"crud",
			Crud,
			{
				crud: {
					dict: {
						sort: {
							prop: "order",
							order: "sort"
						}
					}
				}
			}
		],
		["export", Export],
		["copy", Copy],
		["distpicker", Distpicker],
		["demo", Demo]
	]
};
