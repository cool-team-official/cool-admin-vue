import Base from "./components/base";
import Upload from "./components/upload";
import Chat from "./components/chat";
import Codemirror from "./components/codemirror";
import Copy from "./components/copy";
import Demo from "./components/demo";
import Distpicker from "./components/distpicker";
import EditorQuill from "./components/editor-quill";
import Log from "./components/log";
import Param from "./components/param";
import Perf from "./components/perf";
import Task from "./components/task";
import Crud from "cl-admin-crud";
import Export from "cl-admin-export";

export default {
	components: [
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
		// ["chat", Chat],
		["codemirror", Codemirror],
		["copy", Copy],
		["demo", Demo],
		["distpicker", Distpicker],
		["editor-quill", EditorQuill],
		["log", Log],
		["param", Param],
		["perf", Perf],
		["task", Task]
	]
};
