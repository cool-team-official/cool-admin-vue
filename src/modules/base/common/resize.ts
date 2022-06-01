import { useEventListener } from "@vueuse/core";
import { useStore } from "../store";

function resize() {
	const { app } = useStore();
	app.setBrowser();
	app.isFold = app.browser.isMini;
}

window.onload = function () {
	useEventListener(window, "resize", resize);
	resize();
};
