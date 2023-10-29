<template>
	<div class="select-user__inner">
		<div class="btns">
			<el-button type="success" @click="open">添加</el-button>
			<el-button type="danger" :disabled="list.length == 0" @click="remove">移除</el-button>
		</div>

		<cl-table :data="list" :ref="setRefs('table')" :auto-height="false" />
	</div>

	<cl-dialog v-model="visible" width="1200px" title="选择用户">
		<cl-crud ref="Crud">
			<cl-row>
				<!-- 刷新按钮 -->
				<cl-refresh-btn />

				<cl-filter label="状态">
					<cl-select :options="options.status" prop="status" :width="120" />
				</cl-filter>

				<cl-flex1 />
				<!-- 关键字搜索 -->
				<cl-search-key placeholder="搜索昵称" />
			</cl-row>

			<cl-row>
				<!-- 数据表格 -->
				<cl-table ref="Table" :auto-height="false" />
			</cl-row>

			<cl-row>
				<span>已选 {{ Table?.selection.length }} 人</span>
				<cl-flex1 />
				<!-- 分页控件 -->
				<cl-pagination />
			</cl-row>
		</cl-crud>

		<template #footer>
			<el-button @click="close">取消</el-button>
			<el-button type="success" @click="select">选择</el-button>
		</template>
	</cl-dialog>
</template>

<script lang="ts" setup name="select-user">
import { useCrud, useForm, useTable } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { nextTick, reactive, ref, watch } from "vue";
import { cloneDeep } from "lodash";

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	},
	isDisabled: Boolean,
	prop: String,
	scope: null,
	disabled: Boolean
});

const emit = defineEmits(["update:modelValue"]);

const { service, refs, setRefs } = useCool();

// 上级表单
const Form = useForm();

// 选项
const options = reactive({
	status: [
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
});

// cl-table
const Table = useTable({
	columns: [
		{
			type: "selection",
			width: 60,
			reserveSelection: true
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
			label: "手机号",
			minWidth: 150
		},
		{
			prop: "name",
			label: "姓名",
			minWidth: 150
		},
		{
			prop: "departmentName",
			label: "部门名称",
			minWidth: 150
		},
		{
			label: "状态",
			prop: "status",
			minWidth: 100,
			dict: options.status
		},
		{
			label: "创建时间",
			prop: "createTime",
			sortable: "desc",
			minWidth: 160
		}
	]
});

// cl-crud
const Crud = useCrud({
	service: service.base.sys.user,
	async onRefresh(params, { next }) {
		await next(params);

		// 数据反选
		list.value.forEach((e) => {
			const d = Table.value?.data.find((a) => a.id == e.id);

			if (d) {
				Table.value?.toggleRowSelection(d, true);
			}
		});
	}
});

// 刷新
async function refresh(params?: any) {
	return Crud.value?.refresh(params);
}

// 弹窗是否可见
const visible = ref(false);

// 已选列表
const list = ref<Eps.BaseSysUserEntity[]>([]);

// 打开选择弹窗
function open() {
	visible.value = true;

	nextTick(() => {
		refresh({
			size: 10
		});
	});
}

// 关闭选择弹窗
function close() {
	visible.value = false;
}

// 选择
function select() {
	list.value = cloneDeep(Table.value?.selection || []);
	close();
}

// 移除
function remove() {
	const ids = (refs.table.selection as any[]).map((e) => e.id);

	list.value = list.value.filter((e) => {
		// 清空选择状态
		refs.table.toggleRowSelection(e, false);

		// 移除已选的
		return !ids.find((id) => id == e.id);
	});
}

// 监听已选列表，返回 ids
watch(
	list,
	(arr) => {
		emit(
			"update:modelValue",
			arr.map((e) => e.id)
		);
		Form.value?.validateField(props.prop);
	},
	{
		deep: true
	}
);
</script>

<style lang="scss" scoped>
.select-user__inner {
	.btns {
		margin-bottom: 10px;
	}
}
</style>
