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
	 * 修改个人信息
	 * @returns Promise<any>
	 */
	personUpdate(data?: any): Promise<any>;
	/**
	 * 文件上传模式
	 * @returns Promise<any>
	 */
	uploadMode(data?: any): Promise<any>;
	/**
	 * 权限与菜单
	 * @returns Promise<any>
	 */
	permmenu(data?: any): Promise<any>;
	/**
	 * 个人信息
	 * @returns Promise<any>
	 */
	person(data?: any): Promise<any>;
	/**
	 * 文件上传
	 * @returns Promise<any>
	 */
	upload(data?: any): Promise<any>;
	/**
	 * 退出
	 * @returns Promise<any>
	 */
	logout(data?: any): Promise<any>;
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
		personUpdate: string;
		uploadMode: string;
		permmenu: string;
		person: string;
		upload: string;
		logout: string;
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
	};
}

declare interface BaseOpen {
	/**
	 * 刷新token
	 * @returns Promise<any>
	 */
	refreshToken(data?: any): Promise<any>;
	/**
	 * 验证码
	 * @returns Promise<any>
	 */
	captcha(data?: any): Promise<any>;
	/**
	 * 登录
	 * @returns Promise<any>
	 */
	login(data?: any): Promise<any>;
	/**
	 * 获得网页内容的参数值
	 * @returns Promise<any>
	 */
	html(data?: any): Promise<any>;
	/**
	 * 实体信息与路径
	 * @returns Promise<any>
	 */
	eps(data?: any): Promise<any>;
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
		refreshToken: string;
		captcha: string;
		login: string;
		html: string;
		eps: string;
		list: string;
		page: string;
		info: string;
		update: string;
		delete: string;
		add: string;
	};
}

declare interface BaseSysDepartment {
	/**
	 * 删除
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * 修改
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * 排序
	 * @returns Promise<any>
	 */
	order(data?: any): Promise<any>;
	/**
	 * 列表查询
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * 新增
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
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
	 * 权限
	 */
	permission: {
		delete: string;
		update: string;
		order: string;
		list: string;
		add: string;
		page: string;
		info: string;
	};
}

declare interface BaseSysLog {
	/**
	 * 日志保存时间
	 * @returns Promise<any>
	 */
	setKeep(data?: any): Promise<any>;
	/**
	 * 获得日志保存时间
	 * @returns Promise<any>
	 */
	getKeep(data?: any): Promise<any>;
	/**
	 * 清理
	 * @returns Promise<any>
	 */
	clear(data?: any): Promise<any>;
	/**
	 * 分页查询
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
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
		setKeep: string;
		getKeep: string;
		clear: string;
		page: string;
		list: string;
		info: string;
		update: string;
		delete: string;
		add: string;
	};
}

declare interface BaseSysMenu {
	/**
	 * 删除
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * 修改
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * 单个信息
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * 列表查询
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * 分页查询
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * 新增
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		delete: string;
		update: string;
		info: string;
		list: string;
		page: string;
		add: string;
	};
}

declare interface BaseSysParam {
	/**
	 * 删除
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * 修改
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * 获得网页内容的参数值
	 * @returns Promise<any>
	 */
	html(data?: any): Promise<any>;
	/**
	 * 单个信息
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * 分页查询
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * 新增
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		delete: string;
		update: string;
		html: string;
		info: string;
		page: string;
		add: string;
		list: string;
	};
}

declare interface BaseSysRole {
	/**
	 * 删除
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * 修改
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * 单个信息
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * 列表查询
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * 分页查询
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * 新增
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		delete: string;
		update: string;
		info: string;
		list: string;
		page: string;
		add: string;
	};
}

declare interface BaseSysUser {
	/**
	 * 删除
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * 修改
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * 移动部门
	 * @returns Promise<any>
	 */
	move(data?: any): Promise<any>;
	/**
	 * 单个信息
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * 列表查询
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * 分页查询
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * 新增
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		delete: string;
		update: string;
		move: string;
		info: string;
		list: string;
		page: string;
		add: string;
	};
}

declare interface DemoGoods {
	/**
	 * 删除
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * 修改
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * 单个信息
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * 分页查询
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * 列表查询
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * 新增
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		delete: string;
		update: string;
		info: string;
		page: string;
		list: string;
		add: string;
	};
}

declare interface SpaceInfo {
	/**
	 * 删除
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * 修改
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * 单个信息
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * 列表查询
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * 分页查询
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * 新增
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		delete: string;
		update: string;
		info: string;
		list: string;
		page: string;
		add: string;
	};
}

declare interface SpaceType {
	/**
	 * 删除
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * 修改
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * 单个信息
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * 列表查询
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * 分页查询
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * 新增
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		delete: string;
		update: string;
		info: string;
		list: string;
		page: string;
		add: string;
	};
}

declare interface TaskInfo {
	/**
	 * 删除
	 * @returns Promise<any>
	 */
	delete(data?: any): Promise<any>;
	/**
	 * 修改
	 * @returns Promise<any>
	 */
	update(data?: any): Promise<any>;
	/**
	 * 开始
	 * @returns Promise<any>
	 */
	start(data?: any): Promise<any>;
	/**
	 * 执行一次
	 * @returns Promise<any>
	 */
	once(data?: any): Promise<any>;
	/**
	 * 停止
	 * @returns Promise<any>
	 */
	stop(data?: any): Promise<any>;
	/**
	 * 单个信息
	 * @returns Promise<any>
	 */
	info(data?: any): Promise<any>;
	/**
	 * 分页查询
	 * @returns Promise<PageResponse>
	 */
	page(data?: any): Promise<PageResponse>;
	/**
	 * 日志
	 * @returns Promise<any>
	 */
	log(data?: any): Promise<any>;
	/**
	 * 新增
	 * @returns Promise<any>
	 */
	add(data?: any): Promise<any>;
	/**
	 * list
	 * @returns Promise<any>
	 */
	list(data?: any): Promise<any>;
	/**
	 * 权限
	 */
	permission: {
		delete: string;
		update: string;
		start: string;
		once: string;
		stop: string;
		info: string;
		page: string;
		log: string;
		add: string;
		list: string;
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
	test: Test;
};
