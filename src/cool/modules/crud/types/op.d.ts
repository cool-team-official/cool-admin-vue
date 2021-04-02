export interface RefreshOp {
	/**
	 * 渲染
	 * @param list 数据列表
	 * @param pagination 分页信息
	 */
	render(list: any[], pagination?: { size?: number; page?: number; total?: number }): void;

	/**
	 * 继续执行刷新
	 * @param params 请求参数
	 */
	next(params?: any): Promise<any>;

	/**
	 * 关闭加载状态
	 */
	done(): void;
}

export interface DeleteOp {
	next(params?: any): Promise<any>;
}

export interface UpsertOpenOp {
	/**
	 * 提交表单
	 * @param form 表单值
	 */
	submit(form: any): void;

	/**
	 * 关闭加载状态
	 */
	done(): void;

	/**
	 * 关闭弹窗
	 */
	close(): void;
}

export interface UpsertCloseOp {
	/**
	 * 关闭弹窗
	 */
	done(): void;
}

export interface UpsertInfoOp {
	/**
	 * 继续执行获取详情
	 * @param params 请求参数
	 */
	next(params: any): Promise<any>;

	/**
	 * 关闭加载状态，并设置表单值
	 */
	done(data: any): void;

	/**
	 * 关闭弹窗
	 */
	close(): void;
}

export interface UpsertSubmitOp {
	/**
	 * 继续执行提交
	 * @param params 请求参数
	 */
	next(params: any): Promise<any>;

	/**
	 * 关闭加载状态
	 */
	done(): void;

	/**
	 * 关闭弹窗
	 */
	close(): void;
}

export interface AdvOpenOp {
	/**
	 * 继续执行打开
	 * @param data 筛选参数
	 */
	next(data: any): Promise<any>;
}

export interface AdvCloseOp {
	/**
	 * 关闭抽屉
	 */
	done(): void;
}

export interface AdvSearchOp {
	/**
	 * 继续执行搜索
	 * @param params 请求参数
	 */
	next(params: any): Promise<any>;
	/**
	 * 关闭抽屉
	 */
	done(): void;
}
