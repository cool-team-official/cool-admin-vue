<template>
	<cl-view-group ref="ViewGroup">
		<template #left>
			<dept-tree @refresh="refresh" @user-add="onUserAdd" />
		</template>

		<template #right>
			<cl-crud ref="Crud">
				<cl-row>
					<cl-refresh-btn />
					<cl-add-btn />
					<cl-multi-delete-btn />
					<el-button
						v-permission="service.base.sys.user.permission.move"
						type="success"
						:disabled="Table?.selection.length == 0"
						@click="toMove()"
						>转移</el-button
					>
					<cl-flex1 />
					<cl-search-key placeholder="搜索用户名、姓名" />
				</cl-row>

				<cl-row>
					<cl-table ref="Table">
						<!-- 权限 -->
						<template #column-roleName="{ scope }">
							<template v-if="scope.row.roleName">
								<el-tag
									v-for="(item, index) in scope.row.roleName.split(',')"
									:key="index"
									disable-transitions
									size="small"
									effect="dark"
									style="margin: 2px"
									>{{ item }}
								</el-tag>
							</template>
						</template>

						<!-- 单个转移 -->
						<template #slot-btn="{ scope }">
							<el-button
								v-permission="service.base.sys.user.permission.move"
								text
								bg
								@click="toMove(scope.row)"
								>转移</el-button
							>
						</template>
					</cl-table>
				</cl-row>

				<cl-row>
					<cl-flex1 />
					<cl-pagination />
				</cl-row>

				<!-- 新增、编辑 -->
				<cl-upsert ref="Upsert" />

				<!-- 移动 -->
				<dept-move :ref="setRefs('deptMove')" />
			</cl-crud>
		</template>
	</cl-view-group>
</template>

<script lang="ts" name="sys-user" setup>
import { useTable, useUpsert, useCrud } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { useViewGroup } from "../hooks";
import DeptMove from "./components/dept/move.vue";
import DeptTree from "./components/dept/tree.vue";

const { service, refs, setRefs } = useCool();
const { ViewGroup } = useViewGroup();

// cl-crud 配置
const Crud = useCrud({
	service: service.base.sys.user
});

// cl-table 配置
const Table = useTable({
	columns: [
		{
			type: "selection",
			width: 60
		},
		{
			prop: "headImg",
			label: "头像",
			component: {
				name: "cl-avatar"
			}
		},
		{
			prop: "username",
			label: "用户名",
			minWidth: 150
		},
		{
			prop: "name",
			label: "姓名",
			minWidth: 150
		},
		{
			prop: "nickName",
			label: "昵称",
			minWidth: 150
		},
		{
			prop: "departmentName",
			label: "部门名称",
			minWidth: 150
		},
		{
			prop: "roleName",
			label: "角色",
			headerAlign: "center",
			minWidth: 120
		},
		{
			prop: "status",
			label: "状态",
			minWidth: 120,
			component: {
				name: "cl-switch"
			}
		},
		{
			prop: "phone",
			label: "手机号码",
			minWidth: 150
		},
		{
			prop: "remark",
			label: "备注",
			minWidth: 150
		},
		{
			prop: "createTime",
			label: "创建时间",
			sortable: "desc",
			minWidth: 160
		},
		{
			type: "op",
			buttons: ["slot-btn", "edit", "delete"],
			width: 240
		}
	]
});

// cl-upsert 配置
const Upsert = useUpsert({
	dialog: {
		width: "800px"
	},

	items: [
		{
			prop: "headImg",
			label: "头像",
			component: {
				name: "cl-upload",
				props: {
					text: "选择头像"
				}
			}
		},
		{
			prop: "name",
			label: "姓名",
			span: 12,
			required: true,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "nickName",
			label: "昵称",
			required: true,
			span: 12,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "username",
			label: "用户名",
			required: true,
			span: 12,
			component: {
				name: "el-input"
			}
		},
		() => {
			return {
				prop: "password",
				label: "密码",
				span: 12,
				required: Upsert.value?.mode == "add",
				component: {
					name: "el-input",
					props: {
						type: "password"
					}
				},
				rules: [
					{
						min: 6,
						max: 16,
						message: "密码长度在 6 到 16 个字符"
					}
				]
			};
		},
		{
			prop: "roleIdList",
			label: "角色",
			value: [],
			required: true,
			component: {
				name: "el-select",
				options: [],
				props: {
					multiple: true,
					"multiple-limit": 3
				}
			}
		},
		{
			prop: "phone",
			label: "手机号码",
			span: 12,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "email",
			label: "邮箱",
			span: 12,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "remark",
			label: "备注",
			component: {
				name: "el-input",
				props: {
					type: "textarea",
					rows: 4
				}
			}
		},
		{
			prop: "status",
			label: "状态",
			value: 1,
			component: {
				name: "el-radio-group",
				options: [
					{
						label: "开启",
						value: 1
					},
					{
						label: "关闭",
						value: 0
					}
				]
			}
		}
	],

	onSubmit(data, { next }) {
		next({
			...data,
			departmentId: ViewGroup.value?.selected?.id
		});
	},

	async onOpen() {
		// 设置权限列表
		service.base.sys.role.list().then((res) => {
			Upsert.value?.setOptions(
				"roleIdList",
				res.map((e) => {
					return {
						label: e.name || "",
						value: e.id
					};
				})
			);
		});
	}
});

// 刷新列表
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// 新增成员
function onUserAdd({ id }: Eps.BaseSysDepartmentEntity) {
	Crud.value?.rowAppend({
		departmentId: id
	});
}

// 移动成员
async function toMove(item?: Eps.BaseSysDepartmentEntity) {
	let ids = [];

	if (item) {
		ids = [item.id];
	} else {
		ids = Table.value?.selection.map((e) => e.id) || [];
	}

	refs.deptMove.open(ids);
}
</script>
