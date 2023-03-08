import { createPinia } from "pinia";
import { App } from "vue";
import { createModule } from "./module";
import { createEps } from "./eps";
import { router } from "../router";
import { Loading } from "../utils";

export async function bootstrap(app: App) {
	// pinia
	app.use(createPinia());

	// 路由
	app.use(router);

	// 模块
	const { eventLoop } = createModule(app);

	// eps
	await createEps();

	// 加载
	Loading.set([eventLoop()]);
}
