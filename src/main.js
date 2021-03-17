import Vue from "vue";
import App from "./App.vue";
import { bootstrap } from "cl-admin";
import "./element";

// 路由
import router from "@/router";

// 缓存
import store from "@/store";

// mock
import "@/mock";

// 阻止显示生产模式的消息
Vue.config.productionTip = false;

// 配置
bootstrap()
	.then(() => {
		store.dispatch("appLoad");

		new Vue({
			router,
			store,
			render: h => h(App)
		}).$mount("#app");
	})
	.catch(err => {
		console.error("COOL-ADMIN 启动失败", err);
	});
