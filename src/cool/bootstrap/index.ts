import { createPinia } from "pinia";
import { App } from "vue";
import { createModule } from "./module";
import { router } from "../router";
import { Loading } from "../utils";
import { createEps } from "./eps";

export async function bootstrap(app: App) {
	// pinia
	app.use(createPinia());

	// 路由
	app.use(router);

	// 模块
	const { eventLoop, list } = createModule(app);

	// eps
	createEps(list);

	// 加载
	Loading.set([eventLoop()]);
}
