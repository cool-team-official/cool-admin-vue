import { App, reactive } from "vue";
import { useEventListener } from "./core";

export declare type Browser = {
	screen: string;
	isMini: boolean;
};

export function useBrowser(app?: App) {
	const browser = reactive<Browser>({
		isMini: false,
		screen: "full"
	});

	if (app) {
		useEventListener("resize", () => {
			const w = document.body.clientWidth;

			if (w < 768) {
				browser.screen = "xs";
			} else if (w < 992) {
				browser.screen = "sm";
			} else if (w < 1200) {
				browser.screen = "md";
			} else if (w < 1920) {
				browser.screen = "xl";
			} else {
				browser.screen = "full";
			}

			browser.isMini = browser.screen === "xs";
		});

		app.provide("browser", browser);
	}

	return browser;
}
