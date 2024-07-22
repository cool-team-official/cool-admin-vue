import { setTheme } from "./utils";
import { config } from "/@/config";
import { storage, type ModuleConfig } from "/@/cool";
import "element-plus/theme-chalk/dark/css-vars.css";
import "./static/css/index.scss";

export default (): ModuleConfig => {
	return {
		label: "主题",
		description: "自定义主色、菜单分组、暗黑模式",
		author: "COOL",
		version: "1.0.0",
		updateTime: "2024-07-22",

		toolbar: {
			component: import("./components/theme.vue")
		},

		options: {
			// 推荐主题：'jihei', 'guolv', 'jiangzi'
			name: "default"
			// 自定义主题色
			// color: "#4165d7",
		},

		install(_, options) {
			const data =
				storage.get("theme") ||
				Object.assign(
					{
						isGroup: config.app.menu.isGroup,
						transition: config.app.router.transition
					},
					options
				);

			setTheme(data);
		}
	};
};
