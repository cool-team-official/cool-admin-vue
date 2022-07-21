import store from "store";
import { setTheme } from "./utils";
import { ModuleConfig, config } from "/@/cool";
import "element-plus/theme-chalk/dark/css-vars.css";
import "./static/css/index.scss";

export default (): ModuleConfig => {
	return {
		components: [import("./components/theme.vue")],

		options: {
			// 推荐主题：'jihei', 'guolv', 'jiangzi'
			name: "default"
			// 自定义主题色
			// color: "#4165d7",
		},

		install(_, options) {
			const theme = store.get("theme") || options;

			if (theme) {
				if (theme.isGroup !== undefined) {
					config.app.menu.isGroup = theme.isGroup;
				}

				setTheme(theme);
			}
		}
	};
};
