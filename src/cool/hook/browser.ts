import { useEventListener } from "@vueuse/core";
import { reactive, watch } from "vue";
import { getBrowser } from "../utils";

const browser = reactive(getBrowser());
const events: (() => void)[] = [];

watch(
	() => browser.screen,
	() => {
		events.forEach((ev) => ev());
	}
);

useEventListener(window, "resize", () => {
	Object.assign(browser, getBrowser());
});

export function useBrowser() {
	return {
		browser,
		onScreenChange(ev: () => void, immediate = true) {
			events.push(ev);

			if (immediate) {
				ev();
			}
		}
	};
}
