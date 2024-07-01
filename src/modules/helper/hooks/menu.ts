import { ElMessage } from "element-plus";
import type { EpsModule } from "../types";
import { service } from "/@/cool";
import { useCode } from "./code";

export function useMenu() {
	const { createVue } = useCode();

	// 创建菜单、权限、文件
	function create(data: EpsModule): Promise<() => void> {
		return new Promise((resolve, reject) => {
			// 视图文件路径
			data.viewPath = `modules/${data.module}/views${data.router?.replace(
				`/${data.module}`,
				""
			)}.vue`;

			// 添加菜单
			service.base.sys.menu
				.add({
					type: 1,
					isShow: true,
					keepAlive: true,
					...data,
					api: undefined,
					code: undefined,
					columns: undefined
				})
				.then((res) => {
					// 权限列表
					const perms = data.api?.map((e) => {
						const d = {
							type: 2,
							parentId: res.id,
							name: e.summary || e.path,
							perms: [e.path]
						};

						if (e.path == "/update") {
							if (data.api?.find((a) => a.path == "/info")) {
								d.perms.push("/info");
							}
						}

						return {
							...d,
							perms: d.perms
								.map((e) =>
									(data.prefix?.replace("/admin/", "") + e).replace(/\//g, ":")
								)
								.join(",")
						};
					});

					// 批量插入权限
					service.base.sys.menu.add(perms).then(() => {
						resolve(() => {
							service
								.request({
									url: "/__cool_createMenu",
									method: "POST",
									proxy: false,
									data: {
										code: createVue(data),
										...data
									}
								})
								.then(() => {
									location.reload();
								});
						});
					});
				})
				.catch((err) => {
					ElMessage.error(err.message);
					reject();
				});
		});
	}

	return {
		create,
		createVue
	};
}
