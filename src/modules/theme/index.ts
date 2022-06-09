import store from "store";
import { App } from "vue";
import { setTheme } from "./utils";
import { config } from "/@/cool/config";
import "./static/css/index.scss";

export default {
	install(_: App, options: any) {
		const theme = store.get("theme") || options;

		if (theme) {
			if (theme.isGroup !== undefined) {
				config.app.menu.isGroup = theme.isGroup;
			}

			setTheme(theme);
		}
	}
};
