import { ElMessageBox, ElMessage } from "element-plus";
import { isArray, isObject, isString } from "../../utils";
import { ServiceName } from "@/crud/types";

export function useRequest({ mitt, props, crud }: any) {
	// 刷新随机值，避免脏数据
	let refreshRd = 0;

	// 获取权限
	function getPermission(key: ServiceName): boolean {
		switch (key) {
			case "update":
				return Boolean(crud.permission["update"]);
			default:
				return Boolean(crud.permission[key]);
		}
	}

	// 根据字典替换请求参数
	function paramsReplace(params: any) {
		const { pagination, search, sort } = crud.dict;
		const a: any = { ...params };
		const b: any = { ...pagination, ...search, ...sort };

		for (const i in b) {
			if (a[i]) {
				if (i != b[i]) {
					a[`_${b[i]}`] = a[i];

					delete a[i];
				}
			}
		}

		for (const i in a) {
			if (i[0] === "_") {
				a[i.substr(1)] = a[i];

				delete a[i];
			}
		}

		return a;
	}

	// 刷新请求
	function refresh(newParams?: any) {
		// 合并请求参数
		const reqParams = paramsReplace(Object.assign(crud.params, newParams));

		// Loading
		crud.loading = true;

		// 预防脏数据
		const rd = (refreshRd = Math.random());

		// 完成事件
		const done = () => {
			crud.loading = false;
		};

		// 渲染
		const render = (list: Array<any>, pagination?: any) => {
			mitt.emit("crud.refresh", { list, pagination });
			done();
		};

		// 请求执行
		const next = (params: any) => {
			return new Promise((resolve, reject) => {
				const reqName = crud.dict.api.page;

				if (!crud.service[reqName]) {
					done();
					return reject(`Request function '${reqName}' is not fount`);
				}

				crud.service[reqName](params)
					.then((res: any) => {
						if (rd != refreshRd) {
							return false;
						}

						if (isString(res)) {
							return reject("Response error");
						}

						if (isArray(res)) {
							render(res);
						} else if (isObject(res)) {
							render(res.list, res.pagination);
						}

						resolve(res);
					})
					.catch((err: string) => {
						ElMessage.error(err);
						reject(err);
						console.error(err);
					})
					.done(() => {
						done();
					});
			});
		};

		if (props.onRefresh) {
			return props.onRefresh(reqParams, { next, done, render });
		} else {
			return next(reqParams);
		}
	}

	// 删除请求
	function rowDelete(...selection: Array<any>) {
		// 获取请求方法
		const reqName = crud.dict.api.delete;

		const params = {
			ids: selection.map(e => e.id)
		};

		const next = (params: any) => {
			return new Promise((resolve, reject) => {
				ElMessageBox.confirm(`此操作将永久删除选中数据，是否继续？`, "提示", {
					type: "warning"
				})
					.then((res: any) => {
						if (res === "crudirm") {
							// 验证方法
							if (!crud.service[reqName]) {
								return reject(`Request function '${reqName}' is not fount`);
							}

							// 发送请求
							crud.service[reqName](params)
								.then((res: any) => {
									ElMessage.success(`删除成功`);
									refresh();
									resolve(res);
								})
								.catch((err: string) => {
									ElMessage.error(err);
									reject(err);
								});
						}
					})
					.catch(() => null);
			});
		};

		if (props.onDelete) {
			props.onDelete(selection, { next });
		} else {
			next(params);
		}
	}

	return {
		rowDelete,
		refresh,
		getPermission
	};
}

export function useMitt({ mitt }: any) {
	// 打开新增
	function rowAdd() {
		mitt.emit("crud.add");
	}

	// 打开编辑
	function rowEdit(data: any) {
		mitt.emit("crud.edit", data);
	}

	// 打开追加
	function rowAppend(data: any) {
		mitt.emit("crud.append", data);
	}

	// 关闭新增、编辑弹窗
	function rowClose() {
		mitt.emit("crud.close");
	}

	// 打开高级搜索
	function openAdvSearch() {
		mitt.emit("crud.openAdvSearch");
	}

	// 关闭高级搜索
	function closeAdvSearch() {
		mitt.emit("crud.closeAdvSearch");
	}

	return {
		rowAdd,
		rowEdit,
		rowAppend,
		rowClose,
		openAdvSearch,
		closeAdvSearch
	};
}
