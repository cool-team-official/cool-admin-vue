import { createPinia } from "pinia";
import { App } from "vue";
import { modular } from "./module";
import { router } from "./router";
import { useBase } from "/$/base";
import mitt from "mitt";
import VueECharts from "vue-echarts";
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/src/index.scss";
import "uno.css";

export async function bootstrap(Vue: App) {
	// pinia
	Vue.use(createPinia());

	// element-plus
	Vue.use(ElementPlus);

	// mitt
	Vue.provide("mitt", mitt());

	// charts
	Vue.component("v-chart", VueECharts);

	// 路由
	Vue.use(router);

	// 模块
	Vue.use(modular);

	// 数据
	const { app } = useBase();

	// 事件加载
	app.req = modular.emit("onLoad");
}
