import { Component, Directive } from "vue";
import { Router as VueRouter, RouteRecordRaw } from "vue-router";

export declare type Merge<A, B> = Omit<A, keyof B> & B;

export declare interface ModuleConfig {
	order?: number;
	options?: {
		[key: string]: any;
	};
	components?: Component[];
	views?: RouteRecordRaw[];
	pages?: RouteRecordRaw[];
	install?(app: any, options?: any): any;
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
