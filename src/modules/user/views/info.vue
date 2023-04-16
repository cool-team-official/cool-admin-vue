<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-query field="loginType" :list="[
				{ label: '小程序', value: 0 },
				{ label: '公众号', value: 1 },
				{ label: 'H5', value: 2 },
				{ label: 'App', value: 3 }
			]" />
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table">

				<template #column-avatarUrl="{ scope }">
					<cl-avatar class="cover" :src="scope.row.avatarUrl" :style="{ margin: 'auto' }" />
				</template>

				<template #column-status="{ scope }">
					<el-switch v-model="scope.row._status" active-color=" #ff4949" inactive-color=" #13ce66"
						@change="onStatusChange($event, scope.row)" />
				</template>

				<template #column-labels="{ scope }">
					<el-tag v-for="(item, index) in scope.row.labels" :key="index" size="small" style="margin: 5px 5px 0 0"
						disable-transitions>
						{{ item }}</el-tag>
				</template>

				<template #slot-up-labels="{ scope }">
					<el-button type="text" size="small" @click="updateLabels(scope.row)">编辑标签</el-button>
				</template>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<!-- <cl-upsert ref="Upsert" /> -->
		<cl-form ref="Form" />
	</cl-crud>
</template>

<script lang="ts" name="user-info" setup>
import { useCrud, useTable, useForm } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { ElMessage } from "element-plus";

const { service } = useCool();

// cl-form
const Form = useForm();

// cl-table
const Table = useTable({
	contextMenu: ["refresh", "delete"],
	columns: [
		{
			type: "selection",
			width: 60
		},
		{
			label: "昵称",
			prop: "nickName",
			align: "center",
			minWidth: 150
		},
		{
			label: "头像",
			prop: "avatarUrl",
			align: "center",
			minWidth: 100
		},
		{
			label: "手机",
			prop: "phone",
			align: "center",
			minWidth: 120
		},
		{
			label: "标签",
			prop: "labels",
			align: "center",
			minWidth: 120
		},
		{
			label: "性别",
			prop: "sex",
			align: "center",
			dict: [
				{
					label: "未知",
					value: 0
				},
				{
					label: "男",
					value: 1
				},
				{
					label: "女",
					value: 2
				}
			],
			minWidth: 100
		},
		{
			label: "状态",
			prop: "status",
			align: "center",
			minWidth: 100,
			dict: [
				{
					label: "启用",
					value: 1,
					type: "success"
				},
				{
					label: "禁用",
					value: 0,
					type: "danger"
				}
			]
		},
		{
			label: "来源",
			prop: "loginType",
			dict: [
				{
					label: "小程序",
					value: 0,
					type: "danger"
				},
				{
					label: "公众号",
					value: 1,
					type: "success"
				},
				{
					label: "小程序",
					value: 2,
					type: "primary"
				},
				{
					label: "App",
					value: 3,
					type: "warning"
				}
			]
		},
		{
			label: "创建时间",
			prop: "createTime",
			align: "center",
			sortable: "custom",
			minWidth: 150
		},
		{
			label: "更新时间",
			prop: "updateTime",
			align: "center",
			minWidth: 150
		},
		{
			label: "操作",
			type: "op",
			buttons: ["slot-up-labels", "delete"]
		}
	]
});

// 开启、关闭
function onStatusChange(val: string | number | boolean, item: any) {
	item.status = val ? 0 : 1;
	service.user.info
		.update({ id: item.id, status: item.status })
		.then(() => {
			ElMessage.success(val ? "禁用成功" : "启用成功");
		})
		.catch((err: string) => {
			ElMessage.error(err);
		});
}

function updateLabels(row: any) {
	Form.value?.open({
		items: [
			{
				label: "标签",
				prop: "labels",
				hook: {
					bind: ["split"],
					submit: ["join"]
				},
				component: {
					name: "el-select",
					props: {
						multiple: true,
						filterable: true,
						allowCreate: true
					},
					options: [
						{
							value: "优质用户",
							label: "优质用户"
						},
						{
							value: "普通用户",
							label: "普通用户"
						},
						{
							value: "劣质用户",
							label: "劣质用户"
						}
					]
				}
			}
		],
		on: {
			open(data) {
				data.labels = row.labels;
			},
			submit: (data: any, { close, done }: any) => {
				service.user.info
					.update({
						id: row.id,
						labels: data.labels
					})
					.then(() => {
						ElMessage.success("编辑成功");
						Crud.value?.refresh();
						close();
					})
					.catch((err: any) => {
						ElMessage.error(err);
						done();
					});
			}
		}
	});
}

// cl-crud
const Crud = useCrud(
	{
		service: service.user.info,
		async onRefresh(params, { next, done, render }) {
			const { list } = await next(params);

			render(
				list.map((e: any) => {
					e._status = e.status == 0 ? true : false;
					e.labels = (e.labels || "").split(",").filter(Boolean);
					return e;
				})
			);
		}
	},
	(app) => {
		app.refresh();
	}
);
</script>
