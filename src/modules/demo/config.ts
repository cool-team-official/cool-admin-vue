import type { ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
	return {
		components: [() => import('./views/crud/components/code.vue')],

		views: [
			{
				// 单个参数
				// path: "/demo/test/route/:id",

				// 多个参数
				// path: "/demo/test/route/:id/:name",

				// 参数可选
				path: '/demo/test/route/:id/:name?',

				// 更多看文档：https://router.vuejs.org/zh/guide/essentials/route-matching-syntax.html

				meta: {
					label: '动态路由参数'
				},
				component: () => import('./views/test/route.vue')
			}
		]
	};
};
