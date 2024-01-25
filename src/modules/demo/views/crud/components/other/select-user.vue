<template>
	<div class="select-user__inner">
		<div class="btns">
			<el-button type="success" @click="open">添加</el-button>
			<el-button type="danger" :disabled="refs.table?.selection.length == 0" @click="remove"
				>移除</el-button
			>
		</div>

		<cl-crud padding="0">
			<cl-table :data="data" :ref="setRefs('table')" :auto-height="false" />

			<cl-row type="flex" align="middle" justify="end" :style="{ marginTop: '10px' }">
				<el-pagination
					v-model:current-page="pager.page"
					:page-size="pager.size"
					:total="list.length"
					background
					layout="total, prev, pager, next, jumper"
				/>
			</cl-row>
		</cl-crud>
	</div>

	<cl-dialog v-model="visible" width="1200px" title="选择用户">
		<cl-crud ref="Crud" padding="0">
			<cl-row>
				<!-- 刷新按钮 -->
				<cl-refresh-btn />

				<!-- 全选 -->
				<el-button type="primary" @click="selectAll">全选</el-button>

				<cl-filter label="状态">
					<cl-select :options="options.status" prop="status" :width="120" />
				</cl-filter>

				<cl-flex1 />
				<!-- 关键字搜索 -->
				<cl-search-key placeholder="搜索昵称" />
			</cl-row>

			<cl-row>
				<!-- 数据表格 -->
				<cl-table ref="Table" :auto-height="false" @selection-change="onSelectionChange" />
			</cl-row>

			<cl-row>
				<span>已选 {{ selection.length }} 人</span>
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
import { type PropType, computed, nextTick, reactive, ref, watch } from "vue";
import { cloneDeep } from "lodash-es";

// 替换你的类型
type Item = Eps.BaseSysUserEntity;

const props = defineProps({
	modelValue: {
		type: Array as PropType<Item[]>,
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
	contextMenu: [],
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
			},
			minWidth: 100
		},
		{
			prop: "username",
			label: "手机号",
			minWidth: 120
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
		const res = await next(params);

		// 添加已加载列表的 id
		loadIds.value.push(...res.list.map((e) => e.id));

		// 数据反选
		selection.value.forEach((e) => {
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

// 已选的数据列表，双向绑定用
const list = ref<Item[]>([]);

// 已选列表
const selection = ref<any[]>([]);

// 分页
const pager = reactive({
	page: 1,
	size: 10
});

// 分页数据
const data = computed(() => {
	const { page, size } = pager;
	return list.value.slice((page - 1) * size, page * size);
});

// 已加载列表的 id
const loadIds = ref<number[]>([]);

// 监听已选列表
function onSelectionChange(arr: Item[]) {
	// 已加载的
	const ids = Array.from(new Set(loadIds.value));

	// 过滤掉已加载的，再加上已选的
	selection.value = selection.value.filter((e) => !ids.includes(e.id!)).concat(...arr);
}

// 打开选择弹窗
function open() {
	visible.value = true;

	// 清空数据
	loadIds.value = [];

	// 设置已选
	selection.value = cloneDeep(list.value);

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
	list.value = cloneDeep(selection.value || []);
	close();
}

// 全选
async function selectAll() {
	// 全部数据
	await Crud.value?.refresh({ page: 1, size: 10000 }).then((res) => {
		list.value = res.list;
	});

	// 当前页数据
	// list.value = Table.value?.data || [];

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
	(arr = []) => {
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
