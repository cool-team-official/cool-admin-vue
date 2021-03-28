export interface Token {
	expire: number;
	refreshExpire: number;
	refreshToken: string;
	token: string;
}

export enum MenuType {
	"目录" = 0,
	"菜单" = 1,
	"权限" = 2
}

export interface MenuItem {
	id: number;
	parentId: number;
	path: string;
	router?: string;
	viewPath?: string;
	type: MenuType;
	name: string;
	icon: string;
	orderNum: number;
	isShow: number;
	keepAlive?: number;
	meta?: {
		label: string;
		keepAlive: number;
	};
	children?: MenuItem[];
}
