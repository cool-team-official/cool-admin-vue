declare namespace Eps {
	interface AiAppEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * LOGO
		 */
		logo?: string;
		/**
		 * 名称
		 */
		name?: string;
		/**
		 * 信息库
		 */
		dataId?: number;
		/**
		 * Ai预设
		 */
		prompt?: string;
		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: number;
		/**
		 * 关联上下文 0-否 1-是
		 */
		isContext?: number;
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

	interface AiDataInfoEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 类型ID
		 */
		typeId?: number;
		/**
		 * 标题
		 */
		title?: string;
		/**
		 * 描述
		 */
		description?: string;
		/**
		 * 标签
		 */
		tags?: json;
		/**
		 * 内容
		 */
		content?: longtext;
		/**
		 * 状态 0-准备中 1-已就绪
		 */
		status?: number;
		/**
		 * 启用 0-禁用 1-启用
		 */
		enable?: number;
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

	interface AiDataTypeEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 名称
		 */
		name?: string;
		/**
		 * 图标
		 */
		icon?: string;
		/**
		 * 描述
		 */
		description?: string;
		/**
		 * 类型 0-普通 1-文件
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

	interface AiRecordEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 应用ID
		 */
		appId?: number;
		/**
		 * 对象ID
		 */
		objectId?: string;
		/**
		 * 内容
		 */
		content?: string;
		/**
		 * 角色
		 */
		role?: string;
		/**
		 * 类型 0-用户 1-后台 2-通用
		 */
		type?: number;
		/**
		 * 上下文 0-否 1-是
		 */
		isContext?: number;
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

	interface BaseSysDepartmentEntity {
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
		parentId?: number;
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

	interface BaseSysLogEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 用户ID
		 */
		userId?: number;
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
		params?: json;
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

	interface BaseSysMenuEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 父菜单ID
		 */
		parentId?: number;
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
		 * 类型 0-目录 1-菜单 2-按钮
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

	interface BaseSysParamEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 键
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
		 * 数据类型 0-字符串 1-富文本 2-文件
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

	interface BaseSysRoleEntity {
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
		 * 菜单权限
		 */
		menuIdList?: json;
		/**
		 * 部门权限
		 */
		departmentIdList?: json;
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

	interface BaseSysUserEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 部门ID
		 */
		departmentId?: number;
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
		 * 状态 0-禁用 1-启用
		 */
		status?: number;
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

	interface DictInfoEntity {
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
		 * 父ID
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

	interface DictTypeEntity {
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

	interface DonateInfoEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 用户ID
		 */
		userId?: number;
		/**
		 * 个人或企业名称
		 */
		name?: string;
		/**
		 * 总金额
		 */
		amount?: number;
		/**
		 * 次数
		 */
		num?: number;
		/**
		 * 最近捐赠时间
		 */
		lastTime?: Date;
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

	interface ExtendInfoEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 名称
		 */
		name?: string;
		/**
		 * 简介
		 */
		description?: string;
		/**
		 * Key名
		 */
		keyName?: string;
		/**
		 * Hook
		 */
		hook?: string;
		/**
		 * 描述
		 */
		readme?: string;
		/**
		 * 版本
		 */
		version?: string;
		/**
		 * Logo(base64)
		 */
		logo?: string;
		/**
		 * 作者
		 */
		author?: string;
		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: number;
		/**
		 * 内容
		 */
		content?: json;
		/**
		 * 插件的plugin.json
		 */
		pluginJson?: json;
		/**
		 * 配置
		 */
		config?: json;
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

	interface FlowConfigEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 名称
		 */
		name?: string;
		/**
		 * 描述
		 */
		description?: string;
		/**
		 * 类型
		 */
		type?: string;
		/**
		 * 节点
		 */
		node?: string;
		/**
		 * 配置
		 */
		options?: json;
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

	interface FlowInfoEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 名称
		 */
		name?: string;
		/**
		 * 标签（可以根据标签调用）
		 */
		label?: string;
		/**
		 * 描述
		 */
		description?: string;
		/**
		 * 状态 0-禁用 1-禁用
		 */
		status?: number;
		/**
		 * 版本
		 */
		version?: number;
		/**
		 * 草稿
		 */
		draft?: json;
		/**
		 * 数据
		 */
		data?: json;
		/**
		 * 发布时间
		 */
		releaseTime?: Date;
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

	interface PluginInfoEntity {
		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface HelpInfoEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 用户ID
		 */
		userId?: number;
		/**
		 * 标题
		 */
		title?: string;
		/**
		 * 内容
		 */
		content?: string;
		/**
		 * 类型
		 */
		typeDict?: number;
		/**
		 * 回复数
		 */
		replyCount?: number;
		/**
		 * 浏览数
		 */
		viewCount?: number;
		/**
		 * 是否置顶
		 */
		isTop?: number;
		/**
		 * 最后回复时间
		 */
		lastReplyTime?: Date;
		/**
		 * 是否解决 0-未解决 1-已解决
		 */
		isSolve?: number;
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

	interface HelpReplyEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 用户ID
		 */
		userId?: number;
		/**
		 * 信息ID
		 */
		infoId?: number;
		/**
		 * 内容
		 */
		content?: string;
		/**
		 * 赏金
		 */
		bonus?: number;
		/**
		 * 打赏次数
		 */
		bonusCount?: number;
		/**
		 * 最近打赏时间
		 */
		lastTime?: Date;
		/**
		 * 回复用户ID
		 */
		replyUserId?: number;
		/**
		 * 回复内容
		 */
		replyContent?: string;
		/**
		 * 回复ID
		 */
		replyId?: number;
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

	interface KnowConfigEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 名称
		 */
		name?: string;
		/**
		 * 描述
		 */
		description?: string;
		/**
		 * 类型
		 */
		type?: string;
		/**
		 * 功能
		 */
		func?: string;
		/**
		 * 配置
		 */
		options?: json;
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

	interface KnowDataInfoEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 类型ID
		 */
		typeId?: number;
		/**
		 * 标题
		 */
		title?: string;
		/**
		 * 内容
		 */
		content?: json;
		/**
		 * 来源 0-自定义 1-文件 2-链接
		 */
		from?: number;
		/**
		 * 元数据
		 */
		metadata?: json;
		/**
		 * 状态 0-准备中 1-已就绪
		 */
		status?: number;
		/**
		 * 启用 0-禁用 1-启用
		 */
		enable?: number;
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

	interface KnowDataTypeEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 名称
		 */
		name?: string;
		/**
		 * 图标
		 */
		icon?: string;
		/**
		 * 描述
		 */
		description?: string;
		/**
		 * embedding配置ID
		 */
		embedConfigId?: number;
		/**
		 * embedding配置
		 */
		embedOptions?: json;
		/**
		 * 是否开启rerank 0-否 1-是
		 */
		enableRerank?: number;
		/**
		 * rerank配置ID
		 */
		rerankConfigId?: number;
		/**
		 * rerank配置
		 */
		rerankOptions?: json;
		/**
		 * 链接更新频率(天)
		 */
		updateFrequency?: number;
		/**
		 * 状态 0-禁用 1-启用
		 */
		enable?: number;
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

	interface MsgLearnEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 应用ID
		 */
		appId?: number;
		/**
		 * 标题
		 */
		title?: string;
		/**
		 * 标签
		 */
		tags?: json;
		/**
		 * 内容
		 */
		content?: longtext;
		/**
		 * 状态 0-待审核 1-已通过 2-拒绝
		 */
		status?: number;
		/**
		 * 提交者
		 */
		submitter?: string;
		/**
		 * 提交处
		 */
		submitPlace?: string;
		/**
		 * 附属信息
		 */
		extra?: json;
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

	interface OrderDrawEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 用户ID
		 */
		userId?: number;
		/**
		 * 金额
		 */
		amount?: number;
		/**
		 * 状态 0-申请中 1-已打款
		 */
		status?: number;
		/**
		 * 打款时间
		 */
		drawTime?: Date;
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

	interface OrderInfoEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 用户ID
		 */
		userId?: number;
		/**
		 * 标题
		 */
		title?: string;
		/**
		 * 价格
		 */
		price?: number;
		/**
		 * 类型 0-插件 1-打赏 2-捐赠
		 */
		type?: number;
		/**
		 * 对象ID
		 */
		objectId?: number;
		/**
		 * 状态 0-未支付 1-已支付 2-已退款 3-已关闭
		 */
		status?: number;
		/**
		 * 支付时间
		 */
		payTime?: Date;
		/**
		 * 支付方式 0-微信 1-支付宝
		 */
		payWay?: number;
		/**
		 * 订单号
		 */
		orderNum?: string;
		/**
		 * 退款时间
		 */
		refundTime?: Date;
		/**
		 * 退款金额
		 */
		refundAmount?: number;
		/**
		 * 退款原因
		 */
		refundReason?: string;
		/**
		 * 商品信息
		 */
		goodsInfo?: json;
		/**
		 * 是否提现 0-否 1-是
		 */
		isDraw?: number;
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

	interface PluginInfoEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 用户ID
		 */
		userId?: number;
		/**
		 * 名称
		 */
		name?: string;
		/**
		 * 封面
		 */
		cover?: string;
		/**
		 * 示例图
		 */
		pics?: json;
		/**
		 * 文件
		 */
		fileUrl?: json;
		/**
		 * 版本
		 */
		version?: string;
		/**
		 * 描述
		 */
		description?: string;
		/**
		 * 类型
		 */
		type?: json;
		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: number;
		/**
		 * 标签
		 */
		tags?: json;
		/**
		 * 价格
		 */
		price?: number;
		/**
		 * 审核状态 0-待审核 1-审核通过 2-审核不通过
		 */
		authStatus?: number;
		/**
		 * 审核备注
		 */
		authRemark?: string;
		/**
		 * 是否置顶
		 */
		isTop?: number;
		/**
		 * 下载次数
		 */
		downloadCount?: number;
		/**
		 * 查看次数
		 */
		viewCount?: number;
		/**
		 * 排序更新时间
		 */
		sortUpdateTime?: Date;
		/**
		 * 排序
		 */
		sortNum?: number;
		/**
		 * 联系方式
		 */
		contact?: string;
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

	interface PluginReplyEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 用户ID
		 */
		userId?: number;
		/**
		 * 信息ID
		 */
		infoId?: number;
		/**
		 * 内容
		 */
		content?: string;
		/**
		 * 赏金
		 */
		bonus?: number;
		/**
		 * 打赏次数
		 */
		bonusCount?: number;
		/**
		 * 最近打赏时间
		 */
		lastTime?: Date;
		/**
		 * 回复用户ID
		 */
		replyUserId?: number;
		/**
		 * 回复内容
		 */
		replyContent?: string;
		/**
		 * 回复ID
		 */
		replyId?: number;
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

	interface RecycleDataEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 表
		 */
		entityInfo?: json;
		/**
		 * 操作人
		 */
		userId?: string;
		/**
		 * 被删除的数据
		 */
		data?: json;
		/**
		 * 请求的接口
		 */
		url?: string;
		/**
		 * 请求参数
		 */
		params?: json;
		/**
		 * 删除数据条数
		 */
		count?: number;
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

	interface SpaceInfoEntity {
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
		 * 文件id
		 */
		fileId?: string;
		/**
		 * 文件名
		 */
		name?: string;
		/**
		 * 文件大小
		 */
		size?: number;
		/**
		 * 文档版本
		 */
		version?: number;
		/**
		 * 文件位置
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

	interface SpaceTypeEntity {
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

	interface TaskInfoEntity {
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
		status?: number;
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

	interface UserInfoEntity {
		/**
		 * ID
		 */
		id?: number;
		/**
		 * 登录唯一ID
		 */
		unionid?: string;
		/**
		 * 头像
		 */
		avatarUrl?: string;
		/**
		 * 昵称
		 */
		nickName?: string;
		/**
		 * 邮箱
		 */
		email?: string;
		/**
		 * 手机号
		 */
		phone?: string;
		/**
		 * 性别 0-未知 1-男 2-女
		 */
		gender?: number;
		/**
		 * 状态 0-禁用 1-正常
		 */
		status?: number;
		/**
		 * 登录方式 0-小程序 1-公众号 2-H5
		 */
		loginType?: number;
		/**
		 * SocketID
		 */
		socketId?: string;
		/**
		 * 标签
		 */
		labels?: json;
		/**
		 * 日期
		 */
		date?: string;
		/**
		 * 免费插件
		 */
		freePluginIds?: json;
		/**
		 * 过期时间
		 */
		expireTime?: Date;
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
	interface AiApp {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<AiAppEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<AiAppEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: AiAppEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
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

	interface AiDataInfo {
		/**
		 * 检索
		 */
		search(data?: any): Promise<any>;
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<AiDataInfoEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<AiDataInfoEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: AiDataInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			search: string;
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
			search: boolean;
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

	interface AiDataType {
		/**
		 * 重建
		 */
		rebuild(data?: any): Promise<any>;
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<AiDataTypeEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<AiDataTypeEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: AiDataTypeEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			rebuild: string;
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
			rebuild: boolean;
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

	interface AiRecord {
		/**
		 * 清空所有
		 */
		clearAll(data?: any): Promise<any>;
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 清空
		 */
		clear(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<AiRecordEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<AiRecordEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: AiRecordEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			clearAll: string;
			delete: string;
			update: string;
			clear: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			clearAll: boolean;
			delete: boolean;
			update: boolean;
			clear: boolean;
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

	interface BaseComm {
		/**
		 * 修改个人信息
		 */
		personUpdate(data?: any): Promise<any>;
		/**
		 * 文件上传模式
		 */
		uploadMode(data?: any): Promise<any>;
		/**
		 * 权限与菜单
		 */
		permmenu(data?: any): Promise<any>;
		/**
		 * 个人信息
		 */
		person(data?: any): Promise<any>;
		/**
		 * 文件上传
		 */
		upload(data?: any): Promise<any>;
		/**
		 * 退出
		 */
		logout(data?: any): Promise<any>;
		/**
		 * info
		 */
		info(data?: any): Promise<BaseSysMenuEntity>;
		/**
		 * list
		 */
		list(data?: any): Promise<BaseSysMenuEntity[]>;
		/**
		 * page
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysMenuEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
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
			info: string;
			list: string;
			page: string;
			add: string;
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

	interface BaseOpen {
		/**
		 * 刷新token
		 */
		refreshToken(data?: any): Promise<any>;
		/**
		 * 验证码
		 */
		captcha(data?: any): Promise<any>;
		/**
		 * 登录
		 */
		login(data?: any): Promise<any>;
		/**
		 * 获得网页内容的参数值
		 */
		html(data?: any): Promise<any>;
		/**
		 * 实体信息与路径
		 */
		eps(data?: any): Promise<any>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			refreshToken: string;
			captcha: string;
			login: string;
			html: string;
			eps: string;
			add: string;
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
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface BaseSysDepartment {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 排序
		 */
		order(data?: any): Promise<any>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysDepartmentEntity[]>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			order: string;
			list: string;
			add: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			order: boolean;
			list: boolean;
			add: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface BaseSysLog {
		/**
		 * 日志保存时间
		 */
		setKeep(data?: any): Promise<any>;
		/**
		 * 获得日志保存时间
		 */
		getKeep(data?: any): Promise<any>;
		/**
		 * 清理
		 */
		clear(data?: any): Promise<any>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysLogEntity[];
			[key: string]: any;
		}>;
		/**
		 * list
		 */
		list(data?: any): Promise<BaseSysLogEntity[]>;
		/**
		 * page
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysLogEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			setKeep: string;
			getKeep: string;
			clear: string;
			page: string;
			list: string;
			page: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			setKeep: boolean;
			getKeep: boolean;
			clear: boolean;
			page: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface BaseSysMenu {
		/**
		 * 创建代码
		 */
		create(data?: any): Promise<any>;
		/**
		 * 导出
		 */
		export(data?: any): Promise<any>;
		/**
		 * 导入
		 */
		import(data?: any): Promise<any>;
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 解析
		 */
		parse(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysMenuEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysMenuEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysMenuEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
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
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 获得网页内容的参数值
		 */
		html(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysParamEntity>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysParamEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
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
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface BaseSysRole {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysRoleEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysRoleEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysRoleEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * page
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysRoleEntity[];
			[key: string]: any;
		}>;
		/**
		 * all
		 */
		all(data?: any): Promise<any>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
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
			page: string;
			all: string;
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
			page: boolean;
			all: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface BaseSysUser {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 移动部门
		 */
		move(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysUserEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysUserEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: BaseSysUserEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
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

	interface DictInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 获得字典数据
		 */
		data(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DictInfoEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DictInfoEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DictInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
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
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DictTypeEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DictTypeEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DictTypeEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * page
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DictTypeEntity[];
			[key: string]: any;
		}>;
		/**
		 * all
		 */
		all(data?: any): Promise<any>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
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
			page: string;
			all: string;
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
			page: boolean;
			all: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface DonateInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DonateInfoEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DonateInfoEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DonateInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
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

	interface ExtendInfo {
		/**
		 * 安装插件
		 */
		install(data?: any): Promise<any>;
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ExtendInfoEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ExtendInfoEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: ExtendInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * log
		 */
		log(data?: any): Promise<any>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
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
			log: string;
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
			log: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface FlowConfig {
		/**
		 * 通过名称获取配置
		 */
		getByNode(data?: any): Promise<any>;
		/**
		 * 获取节点配置
		 */
		config(data?: any): Promise<any>;
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<FlowConfigEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<FlowConfigEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: FlowConfigEntity[];
			[key: string]: any;
		}>;
		/**
		 * 获取所有配置
		 */
		all(data?: any): Promise<any>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			getByNode: string;
			config: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			all: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			getByNode: boolean;
			config: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			all: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface FlowInfo {
		/**
		 * 发布流程
		 */
		release(data?: any): Promise<any>;
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<FlowInfoEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<FlowInfoEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: FlowInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			release: string;
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
			release: boolean;
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

	interface FlowRun {
		/**
		 * 调用流程
		 */
		invoke(data?: any): Promise<any>;
		/**
		 * 调试
		 */
		debug(data?: any): Promise<any>;
		/**
		 * update
		 */
		update(data?: any): Promise<any>;
		/**
		 * info
		 */
		info(data?: any): Promise<PluginInfoEntity>;
		/**
		 * list
		 */
		list(data?: any): Promise<PluginInfoEntity[]>;
		/**
		 * page
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: PluginInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			invoke: string;
			debug: string;
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
			invoke: boolean;
			debug: boolean;
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

	interface HelpInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<HelpInfoEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<HelpInfoEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: HelpInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
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

	interface HelpReply {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<HelpReplyEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<HelpReplyEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: HelpReplyEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
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

	interface KnowConfig {
		/**
		 * 通过功能获取配置
		 */
		getByFunc(data?: any): Promise<any>;
		/**
		 * 获取配置
		 */
		config(data?: any): Promise<any>;
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<KnowConfigEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<KnowConfigEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: KnowConfigEntity[];
			[key: string]: any;
		}>;
		/**
		 * 获取所有配置
		 */
		all(data?: any): Promise<any>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			getByFunc: string;
			config: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			all: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			getByFunc: boolean;
			config: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			all: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface KnowDataInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<KnowDataInfoEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<KnowDataInfoEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: KnowDataInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * page
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: KnowDataInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * log
		 */
		log(data?: any): Promise<any>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
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
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
			page: boolean;
			log: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface KnowDataType {
		/**
		 * 重建
		 */
		rebuild(data?: any): Promise<any>;
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<KnowDataTypeEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<KnowDataTypeEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: KnowDataTypeEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			rebuild: string;
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
			rebuild: boolean;
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

	interface KnowLoader {
		/**
		 * 加载文件，支持多个文件
		 */
		file(data?: any): Promise<any>;
		/**
		 * 加载链接
		 */
		link(data?: any): Promise<any>;
		/**
		 * info
		 */
		info(data?: any): Promise<UserInfoEntity>;
		/**
		 * list
		 */
		list(data?: any): Promise<UserInfoEntity[]>;
		/**
		 * page
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: UserInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			file: string;
			link: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};
		/**
		 * 权限状态
		 */
		_permission: {
			file: boolean;
			link: boolean;
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

	interface KnowRetriever {
		/**
		 * 调用
		 */
		invoke(data?: any): Promise<any>;
		/**
		 * list
		 */
		list(data?: any): Promise<ChatMessageEntity[]>;
		/**
		 * info
		 */
		info(data?: any): Promise<ChatMessageEntity>;
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;
		/**
		 * update
		 */
		update(data?: any): Promise<any>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			invoke: string;
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
			invoke: boolean;
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

	interface MsgLearn {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<MsgLearnEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<MsgLearnEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: MsgLearnEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
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

	interface OrderDraw {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<OrderDrawEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<OrderDrawEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: OrderDrawEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
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

	interface OrderInfo {
		/**
		 * 退款
		 */
		refund(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<OrderInfoEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<OrderInfoEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: OrderInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			refund: string;
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
			refund: boolean;
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
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PluginInfoEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PluginInfoEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: PluginInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;
		/**
		 * update
		 */
		update(data?: any): Promise<any>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
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
			delete: string;
			update: string;
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
			delete: boolean;
			update: boolean;
			add: boolean;
		};
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface PluginReply {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PluginReplyEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PluginReplyEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: PluginReplyEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
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

	interface RecycleData {
		/**
		 * 恢复数据
		 */
		restore(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<RecycleDataEntity>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: RecycleDataEntity[];
			[key: string]: any;
		}>;
		/**
		 * 权限标识
		 */
		permission: { restore: string; info: string; page: string };
		/**
		 * 权限状态
		 */
		_permission: { restore: boolean; info: boolean; page: boolean };
		/**
		 * 请求
		 */
		request: Service["request"];
	}

	interface SpaceInfo {
		/**
		 * 获得WPS配置
		 */
		getConfig(data?: any): Promise<any>;
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SpaceInfoEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SpaceInfoEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SpaceInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
		/**
		 * 权限标识
		 */
		permission: {
			getConfig: string;
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
			getConfig: boolean;
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
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SpaceTypeEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SpaceTypeEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: SpaceTypeEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
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
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 开始
		 */
		start(data?: any): Promise<any>;
		/**
		 * 执行一次
		 */
		once(data?: any): Promise<any>;
		/**
		 * 停止
		 */
		stop(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TaskInfoEntity>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: TaskInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * 日志
		 */
		log(data?: any): Promise<any>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
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

	interface UserInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;
		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;
		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserInfoEntity>;
		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UserInfoEntity[]>;
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: UserInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;
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
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: ChatMessageEntity[];
			[key: string]: any;
		}>;
		/**
		 * list
		 */
		list(data?: any): Promise<ChatMessageEntity[]>;
		/**
		 * info
		 */
		info(data?: any): Promise<ChatMessageEntity>;
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;
		/**
		 * update
		 */
		update(data?: any): Promise<any>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
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
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: ChatSessionEntity[];
			[key: string]: any;
		}>;
		/**
		 * list
		 */
		list(data?: any): Promise<ChatSessionEntity[]>;
		/**
		 * info
		 */
		info(data?: any): Promise<ChatSessionEntity>;
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;
		/**
		 * update
		 */
		update(data?: any): Promise<any>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
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
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: TestEntity[];
			[key: string]: any;
		}>;
		/**
		 * update
		 */
		update(data?: any): Promise<any>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
		/**
		 * info
		 */
		info(data?: any): Promise<TestEntity>;
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;
		/**
		 * list
		 */
		list(data?: any): Promise<TestEntity[]>;
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

	interface DemoUserFollow {
		/**
		 * page
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DemoUserFollowEntity[];
			[key: string]: any;
		}>;
		/**
		 * list
		 */
		list(data?: any): Promise<DemoUserFollowEntity[]>;
		/**
		 * info
		 */
		info(data?: any): Promise<DemoUserFollowEntity>;
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;
		/**
		 * update
		 */
		update(data?: any): Promise<any>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
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
		t1(data?: any): Promise<any>;
		/**
		 * t2
		 */
		t2(data?: any): Promise<any>;
		/**
		 * t3
		 */
		t3(data?: any): Promise<any>;
		/**
		 * page
		 */
		page(data?: any): Promise<{
			pagination: { size: number; page: number; total: number; [key: string]: any };
			list: DemoUserInfoEntity[];
			[key: string]: any;
		}>;
		/**
		 * list
		 */
		list(data?: any): Promise<DemoUserInfoEntity[]>;
		/**
		 * info
		 */
		info(data?: any): Promise<DemoUserInfoEntity>;
		/**
		 * delete
		 */
		delete(data?: any): Promise<any>;
		/**
		 * update
		 */
		update(data?: any): Promise<any>;
		/**
		 * add
		 */
		add(data?: any): Promise<any>;
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
		ai: { app: AiApp; data: { info: AiDataInfo; type: AiDataType }; record: AiRecord };
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
		dict: { info: DictInfo; type: DictType };
		donate: { info: DonateInfo };
		extend: { info: ExtendInfo };
		flow: { config: FlowConfig; info: FlowInfo; run: FlowRun };
		help: { info: HelpInfo; reply: HelpReply };
		know: {
			config: KnowConfig;
			data: { info: KnowDataInfo; type: KnowDataType };
			loader: KnowLoader;
			retriever: KnowRetriever;
		};
		msg: { learn: MsgLearn };
		order: { draw: OrderDraw; info: OrderInfo };
		plugin: { info: PluginInfo; reply: PluginReply };
		recycle: { data: RecycleData };
		space: { info: SpaceInfo; type: SpaceType };
		task: { info: TaskInfo };
		user: { info: UserInfo };
		chat: { message: ChatMessage; session: ChatSession };
		test: Test;
		demo: { user: { follow: DemoUserFollow; info: DemoUserInfo } };
	};
}
