declare interface Crud {
	/**
	 * 新增
	 * @returns Promise<any>
	 */
	add(data: any): Promise<any>;
	/**
	 * 删除
	 * @returns Promise<any>
	 */
	delete(data: { ids?: number[] | string[]; [key: string]: any }): Promise<any>;
	/**
	 * 修改
	 * @returns Promise<any>
	 */
	update(data: { id?: number | string; [key: string]: any }): Promise<any>;
	/**
	 * 详情
	 * @returns Promise<any>
	 */
	info(data: { id?: number | string; [key: string]: any }): Promise<any>;
	/**
	 * 全部
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * 分页
	 * @returns Promise<PageResponse>
	 */
	page(data?: {
		page?: number | string;
		size?: number | string;
		[key: string]: any;
	}): Promise<PageResponse>;
}

declare interface PageResponse {
	list: any[];
	pagination: { size: number; page: number; total: number };
	[key: string]: any;
}

declare interface RequestOptions {
	params?: any;
	data?: any;
	url: string;
	method?: "GET" | "get" | "POST" | "post" | string;
	[key: string]: any;
}

declare interface BaseComm {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * personUpdate
	 * @returns Promise<any>
	 */
	personUpdate(data?: any): Promise<any>;
	/**
	 * uploadMode
	 * @returns Promise<any>
	 */
	uploadMode(data?: any): Promise<any>;
	/**
	 * permmenu
	 * @returns Promise<any>
	 */
	permmenu(data?: any): Promise<any>;
	/**
	 * logout
	 * @returns Promise<any>
	 */
	logout(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
		personUpdate: string;
		uploadMode: string;
		permmenu: string;
		logout: string;
	};
}

declare interface BaseOpen {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * refreshToken
	 * @returns Promise<any>
	 */
	refreshToken(data?: any): Promise<any>;
	/**
	 * captcha
	 * @returns Promise<any>
	 */
	captcha(data?: any): Promise<any>;
	/**
	 * login
	 * @returns Promise<any>
	 */
	login(data?: any): Promise<any>;
	/**
	 * html
	 * @returns Promise<any>
	 */
	html(data?: any): Promise<any>;
	/**
	 * eps
	 * @returns Promise<any>
	 */
	eps(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
		refreshToken: string;
		captcha: string;
		login: string;
		html: string;
		eps: string;
	};
}

declare interface BaseSysDepartment {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * order
	 * @returns Promise<any>
	 */
	order(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
		order: string;
	};
}

declare interface BaseSysLog {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * setKeep
	 * @returns Promise<any>
	 */
	setKeep(data?: any): Promise<any>;
	/**
	 * getKeep
	 * @returns Promise<any>
	 */
	getKeep(data?: any): Promise<any>;
	/**
	 * clear
	 * @returns Promise<any>
	 */
	clear(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
		setKeep: string;
		getKeep: string;
		clear: string;
	};
}

declare interface BaseSysMenu {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
	};
}

declare interface BaseSysParam {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * html
	 * @returns Promise<any>
	 */
	html(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
		html: string;
	};
}

declare interface BaseSysRole {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
	};
}

declare interface BaseSysUser {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * move
	 * @returns Promise<any>
	 */
	move(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
		move: string;
	};
}

declare interface DemoGoods {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
	};
}

declare interface SpaceInfo {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
	};
}

declare interface SpaceType {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
	};
}

declare interface TaskInfo {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * start
	 * @returns Promise<any>
	 */
	start(data?: any): Promise<any>;
	/**
	 * once
	 * @returns Promise<any>
	 */
	once(data?: any): Promise<any>;
	/**
	 * stop
	 * @returns Promise<any>
	 */
	stop(data?: any): Promise<any>;
	/**
	 * log
	 * @returns Promise<any>
	 */
	log(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
		start: string;
		once: string;
		stop: string;
		log: string;
	};
}

declare interface ChatMessage {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
	};
}

declare interface ChatSession {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
	};
}

declare interface Test {
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * page
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * info
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * update
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * delete
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * add
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
	};
}

declare type Service = {
	request(data: RequestOptions): Promise<any>;
	base: {
		comm: BaseComm;
		open: BaseOpen;
		sys: {
			department: BaseSysDepartment;
			log: BaseSysLog;
			menu: BaseSysMenu;
			param: BaseSysParam;
			role: BaseSysRole;
			user: BaseSysUser;
		};
	};
	demo: { goods: DemoGoods };
	space: { info: SpaceInfo; type: SpaceType };
	task: { info: TaskInfo };
	chat: { message: ChatMessage; session: ChatSession };
	test: Test;
};
