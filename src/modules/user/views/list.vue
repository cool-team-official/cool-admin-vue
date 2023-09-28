<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<!-- 登录方式 -->
			<cl-filter label="登录方式">
				<cl-select :options="options.loginType" prop="loginType" :width="120" />
			</cl-filter>
			<!-- 性别 -->
			<cl-filter label="性别">
				<cl-select :options="options.gender" prop="gender" :width="120" />
			</cl-filter>
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索昵称、手机号" />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" name="user-list" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { reactive } from "vue";

const { service } = useCool();

// 数据选项
const options = reactive({
	loginType: [
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
			label: "H5",
			value: 2
		}
	],
	gender: [
		{
			label: "未知",
			value: 0,
			type: "info"
		},
		{
			label: "男",
			value: 1,
			type: "success"
		},
		{
			label: "女",
			value: 2,
			type: "danger"
		}
	],
	status: [
		{
			label: "启用",
			value: 1
		},
		{
			label: "禁用",
			value: 0
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{
			type: "selection",
			width: 60
		},
		{
			label: "昵称",
			prop: "nickName",
			minWidth: 150
		},
		{
			label: "头像",
			prop: "avatarUrl",
			minWidth: 100,
			component: {
				name: "cl-avatar"
			}
		},
		{
			label: "手机",
			prop: "phone",
			minWidth: 120
		},
		{
			label: "性别",
			prop: "gender",
			dict: options.gender,
			minWidth: 100
		},
		{
			label: "登录方式",
			prop: "loginType",
			dict: options.loginType,
			minWidth: 100
		},
		{
			label: "状态",
			prop: "status",
			minWidth: 100,
			component: {
				name: "cl-switch"
			}
		},
		{
			label: "创建时间",
			prop: "createTime",
			sortable: "desc",
			minWidth: 150
		},
		{
			label: "操作",
			type: "op",
			buttons: ["edit", "delete"]
		}
	]
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: "600px"
	},
	items: [
		{
			prop: "avatarUrl",
			label: "头像",
			component: { name: "cl-upload" }
		},
		{
			prop: "nickName",
			label: "昵称",
			component: { name: "el-input" },
			required: true
		},
		{
			prop: "phone",
			label: "手机号",
			component: {
				name: "el-input",
				props: {
					maxlength: 11
				}
			}
		},
		{
			prop: "gender",
			label: "性别",
			value: 1,
			component: {
				name: "el-radio-group",
				options: options.gender
			}
		},
		{
			prop: "status",
			label: "状态",
			value: 1,
			component: {
				name: "el-radio-group",
				options: options.status
			}
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.user.info
	},
	(app) => {
		app.refresh();
	}
);
</script>
