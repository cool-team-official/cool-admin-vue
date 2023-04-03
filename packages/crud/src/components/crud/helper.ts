import { deepMerge, isArray, isFunction, isObject, isString, merge } from "../../utils";
import { emitter } from "../../emitter";
import { ElMessageBox, ElMessage } from "element-plus";
import Mitt from "../../utils/mitt";
import { useEventListener } from "../../hooks";
import { ref } from "vue";

interface Options {
	mitt: Mitt;
	config: ClCrud.Config;
	crud: ClCrud.Ref;
}

export function useHelper({ mitt, config, crud }: Options) {
	// 刷新随机值，避免脏数据
	const refreshRd = ref(0);

	// 获取权限
	function getPermission(key: "page" | "list" | "info" | "update" | "add" | "delete"): boolean {
		return Boolean(crud.permission[key]);
	}

	// 根据字典替换请求参数
	function paramsReplace(params: obj) {
		const { pagination, search, sort } = crud.dict;

		// 请求参数
		const a: any = { ...params };

		// 字典
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
	function refresh(params?: obj) {
		const { service, dict } = crud;

		return new Promise((r1) => {
			// 合并请求参数
			const reqParams = paramsReplace(Object.assign(crud.params, params));

			// Loading
			crud.loading = true;

			// 预防脏数据
			const rd = (refreshRd.value = Math.random());

			// 完成事件
			function done() {
				crud.loading = false;
				r1(true);
			}

			// 渲染
			function render(list: any[], pagination?: ClCrud.Pagination) {
				mitt.emit("crud.refresh", { list, pagination });
				done();
			}

			// 下一步
			const next: ClCrud.Service["api"]["page"] = (params) => {
				return new Promise(async (resolve, reject) => {
					await service[dict.api.page](params)
						.then((res) => {
							if (rd != refreshRd.value) {
								return false;
							}

							if (isString(res)) {
								return reject(`service[page] response error`);
							}

							if (isArray(res)) {
								render(res);
							} else if (isObject(res)) {
								render(res.list, res.pagination);
							}

							resolve(res);
							done();
						})
						.catch((err) => {
							ElMessage.error(err.message);
							reject(err);
							done();
						});

					r1(true);
				});
			};

			// 刷新钩子
			if (config.onRefresh) {
				config.onRefresh(reqParams, { next, done, render });
			} else {
				next(reqParams);
			}
		});
	}

	// 打开详情
	function rowInfo(data: any) {
		mitt.emit("crud.proxy", {
			name: "info",
			data: [data]
		});
	}

	// 打开新增
	function rowAdd() {
		mitt.emit("crud.proxy", {
			name: "add"
		});
	}

	// 打开编辑
	function rowEdit(data: any) {
		mitt.emit("crud.proxy", {
			name: "edit",
			data: [data]
		});
	}

	// 打开追加
	function rowAppend(data: any) {
		mitt.emit("crud.proxy", {
			name: "append",
			data: [data]
		});
	}

	// 关闭新增、编辑弹窗
	function rowClose() {
		mitt.emit("crud.proxy", {
			name: "close"
		});
	}

	// 删除请求
	function rowDelete(...selection: any[]) {
		const { service, dict } = crud;

		// 参数
		const params = {
			ids: selection.map((e) => e[dict.primaryId])
		};

		// 下一步
		async function next(data: obj) {
			return new Promise((resolve, reject) => {
				ElMessageBox({
					type: "warning",
					title: dict.label.tips,
					message: dict.label.deleteConfirm,
					confirmButtonText: dict.label.confirm,
					cancelButtonText: dict.label.close,
					showCancelButton: true,
					async beforeClose(action, instance, done) {
						if (action === "confirm") {
							instance.confirmButtonLoading = true;

							await service[dict.api.delete]({ ...params, ...data })
								.then((res) => {
									ElMessage.success(dict.label.deleteSuccess);

									refresh();
									resolve(res);
								})
								.catch((err) => {
									ElMessage.error(err.message);
									reject(err);
								});

							instance.confirmButtonLoading = false;
						}

						done();
					}
				}).catch(() => null);
			});
		}

		// 删除钩子
		if (config.onDelete) {
			config.onDelete(selection, { next });
		} else {
			next(params);
		}
	}

	// 代理
	function proxy(name: string, data?: any[]) {
		mitt.emit("crud.proxy", {
			name,
			data
		});
	}

	// 获取请求参数
	function getParams() {
		return crud.params;
	}

	// 设置
	function set(key: string, value: any) {
		switch (key) {
			// 服务
			case "service":
				Object.assign(crud.service, value);
				crud.service.__proto__ = value.__proto__;
				if (value._permission) {
					for (const i in value._permission) {
						crud.permission[i] = value._permission[i];
					}
				}
				break;

			// 权限
			case "permission":
				if (isFunction(value)) {
					merge(crud.permission, value(crud));
				} else {
					merge(crud.permission, value);
				}
				break;

			default:
				deepMerge(crud[key], value);
				break;
		}
	}

	// 监听事件
	function on(name: string, callback: fn) {
		emitter.on(`${name}-${crud.id}`, callback);
	}

	// 默认值
	set("dict", config.dict);
	set("service", config.service);
	set("permission", config.permission);

	// 监听窗口
	useEventListener("resize", () => {
		mitt.emit("crud.resize");
	});

	return {
		proxy,
		set,
		on,
		rowInfo,
		rowAdd,
		rowEdit,
		rowAppend,
		rowDelete,
		rowClose,
		refresh,
		getPermission,
		paramsReplace,
		getParams
	};
}
