import { useEventListener } from "@vueuse/core";
import { useStore } from "../store";

function update() {
	const { app } = useStore();
	app.setBrowser();
	app.isFold = app.browser.isMini;
}

export function resize() {
	useEventListener(window, "resize", update);
	update();
}
