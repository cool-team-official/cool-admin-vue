declare namespace Eps {
	interface BaseSysDepartmentEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysLogEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysMenuEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysParamEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysRoleEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysUserEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DemoGoodsEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictTypeEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PluginInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RecycleDataEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceTypeEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TaskInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserAddressEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ChatMessageEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ChatSessionEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TestEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DemoUserFollowEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DemoUserInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}
	interface BaseComm {
		/**
		 * personUpdate
		 */
		"personUpdate"(data?: any): Promise<any>;
		/**
		 * uploadMode
		 */
		"uploadMode"(data?: any): Promise<any>;
		/**
		 * permmenu
		 */
		"permmenu"(data?: any): Promise<any>;
		/**
		 * person
		 */
		"person"(data?: any): Promise<any>;
		/**
		 * upload
		 */
		"upload"(data?: any): Promise<any>;
		/**
		 * logout
		 */
		"logout"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			personUpdate: string;
			uploadMode: string;
			permmenu: string;
			person: string;
			upload: string;
			logout: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			personUpdate: boolean;
			uploadMode: boolean;
			permmenu: boolean;
			person: boolean;
			upload: boolean;
			logout: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface BaseOpen {
		/**
		 * refreshToken
		 */
		"refreshToken"(data?: any): Promise<any>;
		/**
		 * captcha
		 */
		"captcha"(data?: any): Promise<any>;
		/**
		 * login
		 */
		"login"(data?: any): Promise<any>;
		/**
		 * html
		 */
		"html"(data?: any): Promise<any>;
		/**
		 * eps
		 */
		"eps"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			refreshToken: string;
			captcha: string;
			login: string;
			html: string;
			eps: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			refreshToken: boolean;
			captcha: boolean;
			login: boolean;
			html: boolean;
			eps: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface BaseSysDepartment {
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * order
		 */
		"order"(data?: any): Promise<any>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<BaseSysDepartmentEntity[]>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: { delete: string; update: string; order: string; list: string; add: string };
		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			order: boolean;
			list: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface BaseSysLog {
		/**
		 * setKeep
		 */
		"setKeep"(data?: any): Promise<any>;
		/**
		 * getKeep
		 */
		"getKeep"(data?: any): Promise<any>;
		/**
		 * clear
		 */
		"clear"(data?: any): Promise<any>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysLogEntity[];
			[key: string]: any;
		}>;
		/**
		 * 权限标识
		 */
		permission: { setKeep: string; getKeep: string; clear: string; page: string };
		/**
		 * 权限状态
		 */
		_permission: { setKeep: boolean; getKeep: boolean; clear: boolean; page: boolean };
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface BaseSysMenu {
		/**
		 * create
		 */
		"create"(data?: any): Promise<any>;
		/**
		 * export
		 */
		"export"(data?: any): Promise<any>;
		/**
		 * import
		 */
		"import"(data?: any): Promise<any>;
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * parse
		 */
		"parse"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<BaseSysMenuEntity>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<BaseSysMenuEntity[]>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysMenuEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			create: string;
			export: string;
			import: string;
			delete: string;
			update: string;
			parse: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			create: boolean;
			export: boolean;
			import: boolean;
			delete: boolean;
			update: boolean;
			parse: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface BaseSysParam {
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * html
		 */
		"html"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<BaseSysParamEntity>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysParamEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			html: string;
			info: string;
			page: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			html: boolean;
			info: boolean;
			page: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface BaseSysRole {
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<BaseSysRoleEntity>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<BaseSysRoleEntity[]>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysRoleEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface BaseSysUser {
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * move
		 */
		"move"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<BaseSysUserEntity>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<BaseSysUserEntity[]>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysUserEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
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
		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			move: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface DemoGoods {
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<DemoGoodsEntity>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<DemoGoodsEntity[]>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DemoGoodsEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DemoGoodsEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface DemoUserFollow {
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DemoUserFollowEntity[];
			[key: string]: any;
		}>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<DemoUserFollowEntity[]>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<DemoUserFollowEntity>;
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			page: string;
			list: string;
			info: string;
			delete: string;
			update: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			page: boolean;
			list: boolean;
			info: boolean;
			delete: boolean;
			update: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface DemoUserInfo {
		/**
		 * t1
		 */
		"t1"(data?: any): Promise<any>;
		/**
		 * t2
		 */
		"t2"(data?: any): Promise<any>;
		/**
		 * t3
		 */
		"t3"(data?: any): Promise<any>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DemoUserInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<DemoUserInfoEntity[]>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<DemoUserInfoEntity>;
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			t1: string;
			t2: string;
			t3: string;
			page: string;
			list: string;
			info: string;
			delete: string;
			update: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			t1: boolean;
			t2: boolean;
			t3: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
			delete: boolean;
			update: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface DictInfo {
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * data
		 */
		"data"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<DictInfoEntity>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<DictInfoEntity[]>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DictInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			data: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			data: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface DictType {
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<DictTypeEntity>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<DictTypeEntity[]>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DictTypeEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface PluginInfo {
		/**
		 * install
		 */
		"install"(data?: any): Promise<any>;
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<PluginInfoEntity>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<PluginInfoEntity[]>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: PluginInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			install: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			install: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface RecycleData {
		/**
		 * restore
		 */
		"restore"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<RecycleDataEntity>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: RecycleDataEntity[];
			[key: string]: any;
		}>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<RecycleDataEntity>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<RecycleDataEntity[]>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: RecycleDataEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: { restore: string; info: string; page: string; list: string; add: string };
		/**
		 * 权限状态
		 */
		_permission: {
			restore: boolean;
			info: boolean;
			page: boolean;
			list: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface SpaceInfo {
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<SpaceInfoEntity>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<SpaceInfoEntity[]>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SpaceInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface SpaceType {
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<SpaceTypeEntity>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<SpaceTypeEntity[]>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SpaceTypeEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface TaskInfo {
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * start
		 */
		"start"(data?: any): Promise<any>;
		/**
		 * once
		 */
		"once"(data?: any): Promise<any>;
		/**
		 * stop
		 */
		"stop"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<TaskInfoEntity>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: TaskInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * log
		 */
		"log"(data?: any): Promise<any>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
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
		};
		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			start: boolean;
			once: boolean;
			stop: boolean;
			info: boolean;
			page: boolean;
			log: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface UserAddress {
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<UserAddressEntity>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<UserAddressEntity[]>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: UserAddressEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface UserInfo {
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<UserInfoEntity>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<UserInfoEntity[]>;
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: UserInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface ChatMessage {
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: ChatMessageEntity[];
			[key: string]: any;
		}>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<ChatMessageEntity[]>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<ChatMessageEntity>;
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			page: string;
			list: string;
			info: string;
			delete: string;
			update: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			page: boolean;
			list: boolean;
			info: boolean;
			delete: boolean;
			update: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface ChatSession {
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: ChatSessionEntity[];
			[key: string]: any;
		}>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<ChatSessionEntity[]>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<ChatSessionEntity>;
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			page: string;
			list: string;
			info: string;
			delete: string;
			update: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			page: boolean;
			list: boolean;
			info: boolean;
			delete: boolean;
			update: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface Test {
		/**
		 * page
		 */
		"page"(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: TestEntity[];
			[key: string]: any;
		}>;
		/**
		 * update
		 */
		"update"(data?: any): Promise<any>;
		/**
		 * add
		 */
		"add"(data?: any): Promise<any>;
		/**
		 * info
		 */
		"info"(data?: any): Promise<TestEntity>;
		/**
		 * delete
		 */
		"delete"(data?: any): Promise<any>;
		/**
		 * list
		 */
		"list"(data?: any): Promise<TestEntity[]>;
		/**
		 * 权限标识
		 */
		permission: {
			page: string;
			update: string;
			add: string;
			info: string;
			delete: string;
			list: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			page: boolean;
			update: boolean;
			add: boolean;
			info: boolean;
			delete: boolean;
			list: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	type json = any;

	type Service = {
		request(options?: {
			url: string;
			method?: "POST" | "GET" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
			data?: any;
			params?: any;
			headers?: {
				[key: string]: any;
			};
			timeout?: number;
			proxy?: boolean;
			[key: string]: any;
		}): Promise<any>;
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
		demo: { goods: DemoGoods; user: { follow: DemoUserFollow; info: DemoUserInfo } };
		dict: { info: DictInfo; type: DictType };
		plugin: { info: PluginInfo };
		recycle: { data: RecycleData };
		space: { info: SpaceInfo; type: SpaceType };
		task: { info: TaskInfo };
		user: { address: UserAddress; info: UserInfo };
		chat: { message: ChatMessage; session: ChatSession };
		test: Test;
	};
}
