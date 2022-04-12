import { createPinia } from "pinia";
import { App } from "vue";
import { useModule } from "./module";
import { router, addViews } from "./router";
import { useBaseStore } from "/$/base";
import mitt from "mitt";
import VueECharts from "vue-echarts";
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/src/index.scss";
import "uno.css";

export async function bootstrap(Vue: App) {
	// 缓存
	Vue.use(createPinia());

	// ui库
	Vue.use(ElementPlus);

	// 事件通讯
	Vue.provide("mitt", mitt());

	// 可视图表
	Vue.component("v-chart", VueECharts);

	// 基础
	const { app, user, menu } = useBaseStore();

	// 加载模块
	useModule(Vue);

	// 取缓存视图
	addViews(menu.routes);

	// 路由
	Vue.use(router);

	// 开启
	app.showLoading();

	if (user.token) {
		// 获取用户信息
		user.get();

		// 获取菜单权限
		await menu.get();
	}

	app.hideLoading();
}
