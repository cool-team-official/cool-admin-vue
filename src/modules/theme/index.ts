import store from "store";
import { App } from "vue";
import { setTheme } from "./utils";

export default {
	install(_: App, options: any) {
		const theme = store.get("theme") || options;

		if (theme) {
			setTheme(theme);
		}
	}
};
