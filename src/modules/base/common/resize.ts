import { useEventListener } from "@vueuse/core";
import { useBaseStore } from "../store";

function resize() {
	const { app } = useBaseStore();
	app.setBrowser();
	app.isFold = app.browser.isMini;
}

window.onload = function () {
	useEventListener(window, "resize", resize);
	resize();
};
