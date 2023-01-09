import { RouteComponent, RouteLocationNormalized } from "vue-router";

export declare namespace Menu {
	enum Type {
		"目录" = 0,
		"菜单" = 1,
		"权限" = 2
	}

	interface Item {
		id: number;
		parentId: number;
		path: string;
		router?: string;
		viewPath?: string;
		type: Type;
		name: string;
		icon: string;
		orderNum: number;
		isShow: number | boolean;
		keepAlive?: number;
		meta?: {
			label?: string;
			keepAlive?: number | boolean;
			iframeUrl?: string;
		};
		children?: Item[];
		component?: RouteComponent;
		redirect?: string;
	}

	type List = Item[];
}

export declare namespace Process {
	interface Item extends RouteLocationNormalized {
		active: boolean;
	}

	type List = Item[];
}

export declare interface ClViewGroup {
	selected:
		| {
				id?: number;
				[key: string]: any;
		  }
		| undefined;
	isExpand: boolean;
	setTitle(value?: string): void;
	select(data?: any): void;
	expand(value?: boolean): void;
}
