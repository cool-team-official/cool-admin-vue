<template>
	<div class="view-plugin">
		<cl-crud ref="crud" :on-refresh="onRefresh" @load="onLoad">
			<el-row type="flex" align="middle">
				<!-- 刷新按钮 -->
				<cl-refresh-btn />
				<cl-flex1 />
				<!-- 关键字搜索 -->
				<cl-search-key />
			</el-row>

			<el-row>
				<!-- 数据表格 -->
				<cl-table v-bind="table">
					<template #column-enable="{ scope }">
						<el-switch
							v-model="scope.row._enable"
							size="mini"
							:disabled="!perms.enable"
							@change="onEnableChange($event, scope.row)"
						></el-switch>
					</template>

					<!-- 配置按钮 -->
					<template #slot-conf="{ scope }">
						<el-button
							type="text"
							size="mini"
							v-if="scope.row.view && perms.edit"
							@click="openConf(scope.row)"
							>配置</el-button
						>
					</template>
				</cl-table>
			</el-row>

			<el-row type="flex">
				<cl-flex1 />
				<!-- 分页控件 -->
				<cl-pagination layout="total" />
			</el-row>
		</cl-crud>

		<!-- 表单 -->
		<cl-form :ref="setRefs('form')"></cl-form>
	</div>
</template>

<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent, inject, reactive } from "vue";
import { checkPerm } from "@/cool/modules/base";
import { useRefs } from "@/core";
import { CrudLoad, RefreshOp, Table } from "@/crud/types";

export default defineComponent({
	name: "plugin",

	setup() {
		const $service = inject<any>("service");
		const { refs, setRefs } = useRefs();

		// 编辑权限
		const { config, getConfig, enable } = $service.plugin.info.permission;

		const perms = reactive<any>({
			edit: checkPerm({
				and: [config, getConfig]
			}),
			enable: checkPerm(enable)
		});

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			ctx.service($service.plugin.info)
				.set("dict", {
					api: {
						page: "list"
					}
				})
				.done();
			app.refresh();
		}

		// 刷新钩子
		function onRefresh(params: any, { next, render }: RefreshOp) {
			next(params).then((res: any) => {
				const list = res.map((e: any) => {
					e._enable = e.enable ? true : false;
					return e;
				});

				render(list, {
					total: res.length
				});
			});
		}

		// 开启、关闭
		function onEnableChange(val: boolean, item: any) {
			$service.plugin.info
				.enable({
					namespace: item.namespace,
					enable: val
				})
				.then(() => {
					ElMessage.success(val ? "开启成功" : "关闭成功");
				})
				.catch((err: string) => {
					ElMessage.error(err);
				});
		}

		// 打开配置
		async function openConf({ name, namespace, view }: any) {
			const form = await $service.plugin.info.getConfig({
				namespace
			});

			let items = [];

			try {
				items = JSON.parse(view);
			} catch (e) {
				items = [];
			}

			refs.value.form.open({
				title: `${name}配置`,
				items,
				form,
				on: {
					submit: (data: any, { close, done }: any) => {
						$service.plugin.info
							.config({
								namespace,
								config: data
							})
							.then(() => {
								ElMessage.success("保存成功");
								close();
							})
							.catch((err: string) => {
								ElMessage.error(err);
								done();
							});
					}
				}
			});
		}

		// 表格配置
		const table = reactive<Table>({
			props: {
				"default-sort": {
					prop: "createTime",
					order: "descending"
				}
			},
			"context-menu": [
				"refresh",
				(scope: any) => {
					return {
						label: "配置",
						hidden: !perms.edit || !scope.view,
						callback: (_: any, done: Function) => {
							openConf(scope);
							done();
						}
					};
				}
			],
			columns: [
				{
					label: "名称",
					prop: "name",
					minWidth: 140
				},
				{
					label: "作者",
					prop: "author",
					minWidth: 120
				},
				{
					label: "联系方式",
					prop: "contact",
					showOverflowTooltip: true,
					minWidth: 180
				},
				{
					label: "功能描述",
					prop: "description",
					showOverflowTooltip: true,
					minWidth: 150
				},
				{
					label: "版本号",
					prop: "version",
					minWidth: 110
				},
				{
					label: "是否启用",
					prop: "enable",
					minWidth: 110
				},
				{
					label: "命名空间",
					prop: "namespace",
					minWidth: 110
				},
				{
					label: "状态",
					prop: "status",
					width: 150,
					dict: [
						{
							label: "缺少配置",
							value: 0,
							type: "warning"
						},
						{
							label: "可用",
							value: 1,
							type: "success"
						},
						{
							label: "配置错误",
							value: 2,
							type: "danger"
						},
						{
							label: "未知错误",
							value: 3,
							type: "danger"
						}
					]
				},
				{
					label: "创建时间",
					prop: "createTime",
					width: 150,
					sortable: "custom"
				},
				{
					type: "op",
					width: 120,
					buttons: ["slot-conf"]
				}
			]
		});

		return {
			refs,
			perms,
			table,
			setRefs,
			onLoad,
			onRefresh,
			onEnableChange,
			openConf
		};
	}
});
</script>
