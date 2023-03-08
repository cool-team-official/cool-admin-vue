import { Component, Directive, App } from "vue";
import { Router as VueRouter, RouteRecordRaw } from "vue-router";

export declare type Merge<A, B> = Omit<A, keyof B> & B;

export declare interface Config {
	app: {
		name: string;
		menu: {
			isGroup: boolean;
			list?: {
				// 名称
				name: string;
				// 类型 0-目录 1-菜单
				type: 0 | 1;
				// 访问路径
				path?: `/${string}`;
				// 渲染组件
				component?: Component;
				// 是否显示
				isShow?: boolean;
				// svg 图标
				icon?: string;
				// 其他
				meta?: {
					// 是否添加到进程栏
					process?: boolean;
					// 是否缓存
					keepAlive?: boolean;
				};
				// 子集
				children?: Config["app"]["menu"]["list"];
				[key: string]: any;
			}[];
		};

		// 路由
		router: {
			// 模式
			mode: "history" | "hash";
			// 转场动画
			transition: "slide" | "none";
			// 首页组件
			home: Component;
		};

		// 字体图标库
		iconfont: string[];
	};
	// 忽略规则
	ignore: {
		// 不显示请求进度条
		NProgress: string[];
		// 页面不需要登录验证
		token: string[];
	};
	// 调试
	test: {
		token: string;
		mock: boolean;
		eps: boolean;
	};
	// 根地址
	host: string;
	// 请求地址
	baseUrl: string;
	[key: string]: any;
}

export declare interface ModuleConfig {
	order?: number;
	options?: {
		[key: string]: any;
	};
	components?: Component[];
	views?: RouteRecordRaw[];
	pages?: RouteRecordRaw[];
	install?(app: App, options?: any): any;
	onLoad?(events: {
		hasToken: (cb: () => Promise<any> | void) => Promise<any> | void;
		[key: string]: any;
	}): Promise<{ [key: string]: any }> | Promise<void> | void;
}

export declare interface Module extends ModuleConfig {
	name: string;
	options: {
		[key: string]: any;
	};
	value?: any;
	services?: { path: string; value: any }[];
	directives?: { name: string; value: Directive }[];
}

export declare interface Router extends VueRouter {
	find(path: string): RouteRecordRaw | undefined;
	append(data: any[] | any): void;
	[key: string]: any;
}
