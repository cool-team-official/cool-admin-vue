import { Component, Directive, App } from "vue";
import { Router as VueRouter, RouteRecordRaw } from "vue-router";

export declare type Merge<A, B> = Omit<A, keyof B> & B;

export declare interface ModuleConfig {
	order?: number;
	options?: {
		[key: string]: any;
	};
	toolbar?: {
		order?: number;
		pc?: boolean;
		h5?: boolean;
		component: Promise<any>;
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
	[key: string]: any;
}

export declare interface Router extends VueRouter {
	find(path: string): RouteRecordRaw | undefined;
	append(
		data: {
			name?: string;
			path: string;
			component?: any;
			viewPath?: string;
			isPage?: boolean;
			[key: string]: any;
		}[]
	): void;
	register(path: string): Promise<{ route: RouteRecordRaw | undefined; isReg: boolean }>;
	[key: string]: any;
}
