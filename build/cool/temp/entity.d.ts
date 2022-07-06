declare interface BaseSysDepartmentEntity {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 部门名称
	 */
	name?: string;
	/**
	 * 上级部门ID
	 */
	parentId?: BigInt;
	/**
	 * 排序
	 */
	orderNum?: number;
	/**
	 * 创建时间
	 */
	createTime?: Date;
	/**
	 * 更新时间
	 */
	updateTime?: Date;
	/**
	 * 任意键值
	 */
	[key: string]: any;
}

declare interface BaseSysLogEntity {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 用户ID
	 */
	userId?: BigInt;
	/**
	 * 行为
	 */
	action?: string;
	/**
	 * ip
	 */
	ip?: string;
	/**
	 * ip地址
	 */
	ipAddr?: string;
	/**
	 * 参数
	 */
	params?: string;
	/**
	 * 创建时间
	 */
	createTime?: Date;
	/**
	 * 更新时间
	 */
	updateTime?: Date;
	/**
	 * 任意键值
	 */
	[key: string]: any;
}

declare interface BaseSysMenuEntity {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 父菜单ID
	 */
	parentId?: BigInt;
	/**
	 * 菜单名称
	 */
	name?: string;
	/**
	 * 菜单地址
	 */
	router?: string;
	/**
	 * 权限标识
	 */
	perms?: string;
	/**
	 * 类型 0：目录 1：菜单 2：按钮
	 */
	type?: number;
	/**
	 * 图标
	 */
	icon?: string;
	/**
	 * 排序
	 */
	orderNum?: number;
	/**
	 * 视图地址
	 */
	viewPath?: string;
	/**
	 * 路由缓存
	 */
	keepAlive?: boolean;
	/**
	 * 是否显示
	 */
	isShow?: boolean;
	/**
	 * 创建时间
	 */
	createTime?: Date;
	/**
	 * 更新时间
	 */
	updateTime?: Date;
	/**
	 * 任意键值
	 */
	[key: string]: any;
}

declare interface BaseSysParamEntity {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 键位
	 */
	keyName?: string;
	/**
	 * 名称
	 */
	name?: string;
	/**
	 * 数据
	 */
	data?: string;
	/**
	 * 数据类型 0:字符串 1：数组 2：键值对
	 */
	dataType?: number;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 创建时间
	 */
	createTime?: Date;
	/**
	 * 更新时间
	 */
	updateTime?: Date;
	/**
	 * 任意键值
	 */
	[key: string]: any;
}

declare interface BaseSysRoleEntity {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 用户ID
	 */
	userId?: string;
	/**
	 * 名称
	 */
	name?: string;
	/**
	 * 角色标签
	 */
	label?: string;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 数据权限是否关联上下级
	 */
	relevance?: number;
	/**
	 * 创建时间
	 */
	createTime?: Date;
	/**
	 * 更新时间
	 */
	updateTime?: Date;
	/**
	 * 任意键值
	 */
	[key: string]: any;
}

declare interface BaseSysUserEntity {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 部门ID
	 */
	departmentId?: BigInt;
	/**
	 * 姓名
	 */
	name?: string;
	/**
	 * 用户名
	 */
	username?: string;
	/**
	 * 密码
	 */
	password?: string;
	/**
	 * 密码版本, 作用是改完密码，让原来的token失效
	 */
	passwordV?: number;
	/**
	 * 昵称
	 */
	nickName?: string;
	/**
	 * 头像
	 */
	headImg?: string;
	/**
	 * 手机
	 */
	phone?: string;
	/**
	 * 邮箱
	 */
	email?: string;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 状态 0:禁用 1：启用
	 */
	status?: boolean;
	/**
	 * socketId
	 */
	socketId?: string;
	/**
	 * 创建时间
	 */
	createTime?: Date;
	/**
	 * 更新时间
	 */
	updateTime?: Date;
	/**
	 * 任意键值
	 */
	[key: string]: any;
}

declare interface DemoGoodsEntity {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 标题
	 */
	title?: string;
	/**
	 * 图片
	 */
	pic?: string;
	/**
	 * 价格
	 */
	price?: number;
	/**
	 * 分类
	 */
	type?: number;
	/**
	 * 创建时间
	 */
	createTime?: Date;
	/**
	 * 更新时间
	 */
	updateTime?: Date;
	/**
	 * 任意键值
	 */
	[key: string]: any;
}

declare interface DictInfoEntity {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 类型ID
	 */
	typeId?: number;
	/**
	 * 名称
	 */
	name?: string;
	/**
	 * 排序
	 */
	orderNum?: number;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 创建时间
	 */
	createTime?: Date;
	/**
	 * 更新时间
	 */
	updateTime?: Date;
	/**
	 * 任意键值
	 */
	[key: string]: any;
}

declare interface DictTypeEntity {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 名称
	 */
	name?: string;
	/**
	 * 标识
	 */
	key?: string;
	/**
	 * 创建时间
	 */
	createTime?: Date;
	/**
	 * 更新时间
	 */
	updateTime?: Date;
	/**
	 * 任意键值
	 */
	[key: string]: any;
}

declare interface SpaceInfoEntity {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 地址
	 */
	url?: string;
	/**
	 * 类型
	 */
	type?: string;
	/**
	 * 分类ID
	 */
	classifyId?: BigInt;
	/**
	 * 创建时间
	 */
	createTime?: Date;
	/**
	 * 更新时间
	 */
	updateTime?: Date;
	/**
	 * 任意键值
	 */
	[key: string]: any;
}

declare interface SpaceTypeEntity {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 类别名称
	 */
	name?: string;
	/**
	 * 父分类ID
	 */
	parentId?: number;
	/**
	 * 创建时间
	 */
	createTime?: Date;
	/**
	 * 更新时间
	 */
	updateTime?: Date;
	/**
	 * 任意键值
	 */
	[key: string]: any;
}

declare interface TaskInfoEntity {
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 任务ID
	 */
	jobId?: string;
	/**
	 * 任务配置
	 */
	repeatConf?: string;
	/**
	 * 名称
	 */
	name?: string;
	/**
	 * cron
	 */
	cron?: string;
	/**
	 * 最大执行次数 不传为无限次
	 */
	limit?: number;
	/**
	 * 每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效
	 */
	every?: number;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 状态 0:停止 1：运行
	 */
	status?: boolean;
	/**
	 * 开始时间
	 */
	startDate?: Date;
	/**
	 * 结束时间
	 */
	endDate?: Date;
	/**
	 * 数据
	 */
	data?: string;
	/**
	 * 执行的service实例ID
	 */
	service?: string;
	/**
	 * 状态 0:系统 1：用户
	 */
	type?: number;
	/**
	 * 下一次执行时间
	 */
	nextRunTime?: Date;
	/**
	 * 状态 0:cron 1：时间间隔
	 */
	taskType?: number;
	/**
	 * 创建时间
	 */
	createTime?: Date;
	/**
	 * 更新时间
	 */
	updateTime?: Date;
	/**
	 * 任意键值
	 */
	[key: string]: any;
}
