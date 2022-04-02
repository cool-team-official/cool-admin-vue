import { useBaseStore } from "../store";

function resize() {
	const { app } = useBaseStore();
	app.setBrowser();
	app.isFold = app.browser.isMini;
}

window.onload = function () {
	window.addEventListener("resize", resize);
	resize();
};
