import { setTheme } from "./utils";
import { config, ModuleConfig, storage } from "/@/cool";
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
