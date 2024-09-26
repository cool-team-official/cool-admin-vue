<template>
	<div class="user-select__inner">
		<template v-if="multiple">
			<div class="btns">
				<el-button type="success" @click="open">添加</el-button>
				<el-button
					type="danger"
					:disabled="refs.table?.selection.length == 0"
					@click="remove"
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
		</template>

		<template v-else>
			<div class="user" @click="open">
				<template v-if="data[0]">
					<cl-avatar :size="24" :src="data[0].avatarUrl"></cl-avatar>
					<span>{{ data[0].nickName }}</span>

					<el-icon @click.stop="remove">
						<circle-close />
					</el-icon>
				</template>

				<span class="placeholder" v-else>请选择用户</span>
			</div>
		</template>
	</div>

	<cl-dialog v-model="visible" width="1200px" title="选择用户">
		<cl-crud ref="Crud" padding="0">
			<cl-row>
				<!-- 刷新按钮 -->
				<cl-refresh-btn />

				<!-- 全选 -->
				<el-button type="primary" @click="selectAll" v-if="multiple">全选</el-button>

				<cl-filter label="状态">
					<cl-select :options="options.status" prop="status" :width="120" />
				</cl-filter>

				<cl-flex1 />
				<!-- 关键字搜索 -->
				<cl-search-key placeholder="搜索昵称、手机号" />
			</cl-row>

			<cl-row>
				<!-- 数据表格 -->
				<cl-table ref="Table" :auto-height="false" @selection-change="onSelectionChange">
					<template #column-check="{ scope }">
						<el-button type="success" disabled v-if="selection[0]?.id == scope.row.id"
							>已选</el-button
						>
						<el-button @click="select(scope.row)" v-else>选择</el-button>
					</template>
				</cl-table>
			</cl-row>

			<cl-row>
				<span v-if="multiple">已选 {{ selection.length }} 人</span>
				<cl-flex1 />
				<!-- 分页控件 -->
				<cl-pagination />
			</cl-row>
		</cl-crud>

		<template #footer>
			<el-button @click="close">取消</el-button>
			<el-button
				type="success"
				:disabled="isEmpty(selection)"
				@click="select()"
				v-if="multiple"
				>选择</el-button
			>
		</template>
	</cl-dialog>
</template>

<script lang="ts" setup name="user-select">
import { useCrud, useForm, useTable } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { type PropType, computed, nextTick, reactive, ref, watch } from "vue";
import { cloneDeep, isArray, isEmpty } from "lodash-es";
import { CircleClose } from "@element-plus/icons-vue";

// 替换你的类型
type Item = Eps.UserInfoEntity;

const props = defineProps({
	modelValue: null,
	isDisabled: Boolean,
	prop: String,
	scope: Object as PropType<Item>,
	disabled: Boolean,

	// 是否多选
	multiple: {
		type: Boolean,
		default: true
	}
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
		props.multiple
			? {
					type: "selection",
					width: 60,
					reserveSelection: true
				}
			: {
					label: "操作",
					prop: "check",
					width: 100
				},
		{
			prop: "avatarUrl",
			label: "头像",
			component: {
				name: "cl-avatar"
			},
			minWidth: 100
		},
		{
			prop: "phone",
			label: "手机号",
			minWidth: 120
		},
		{
			prop: "nickName",
			label: "姓名",
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
			minWidth: 170
		}
	]
});

// cl-crud
const Crud = useCrud({
	service: service.user.info,
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

// 设置值
function set(data: Item[] | Item) {
	list.value = cloneDeep(isArray(data) ? data : [data]);
}

// 选择
function select(item?: Item) {
	// 单选不触发 onSelectionChange 手动设置
	if (item) {
		selection.value = [item];
	}

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
	const ids = selection.value.map((e) => e.id);

	list.value = list.value.filter((e) => {
		// 清空选择状态
		refs.table?.toggleRowSelection(e, false);

		// 移除已选的
		return !ids.find((id) => id == e.id);
	});
}

// 监听已选列表，返回 ids/id
watch(
	list,
	(arr = []) => {
		const ids = arr.map((e) => e.id);

		if (props.multiple) {
			emit("update:modelValue", ids);
		} else {
			emit("update:modelValue", ids[0]);
		}

		Form.value?.validateField(props.prop);
	},
	{
		deep: true
	}
);

defineExpose({
	set,
	remove,
	select,
	selectAll
});
</script>

<style lang="scss" scoped>
.user-select__inner {
	.btns {
		margin-bottom: 10px;
	}

	.user {
		display: flex;
		align-items: center;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-border-radius-base);
		padding: 0 10px;
		height: 32px;
		cursor: pointer;
		position: relative;

		.cl-avatar {
			margin-right: 6px;
		}

		.el-icon,
		.placeholder {
			color: var(--el-text-color-placeholder);
		}

		.el-icon {
			position: absolute;
			right: 10px;
		}

		&:hover {
			border-color: var(--el-color-primary);
		}
	}
}
</style>
