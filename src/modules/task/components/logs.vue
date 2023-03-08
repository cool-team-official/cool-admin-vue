<template>
	<cl-dialog v-model="visible" :title="title" width="1000px">
		<cl-crud ref="Crud" padding="0">
			<cl-row>
				<!-- 刷新按钮 -->
				<cl-refresh-btn />
				<!-- 状态 -->
				<cl-filter label="状态">
					<cl-select :options="options.status" prop="status" />
				</cl-filter>
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
		</cl-crud>
	</cl-dialog>
</template>

<script lang="ts" setup>
import { useCrud, useTable } from "@cool-vue/crud";
import { nextTick, reactive, ref } from "vue";
import { useCool } from "/@/cool";

const { service } = useCool();

// 是否可见
const visible = ref(false);

// 标题
const title = ref("");

// 选项
const options = reactive({
	status: [
		{
			label: "成功",
			value: 1,
			type: "success"
		},
		{
			label: "失败",
			value: 0,
			type: "danger"
		}
	]
});

// cl-table
const Table = useTable({
	autoHeight: false,
	columns: [
		{
			label: "#",
			type: "index"
		},
		{
			label: "描述",
			prop: "detail",
			showOverflowTooltip: true,
			minWidth: 200
		},
		{
			label: "执行状态",
			prop: "status",
			minWidth: 120,
			dict: options.status
		},
		{
			label: "执行时间",
			prop: "createTime",
			minWidth: 160
		}
	]
});

// cl-crud
const Crud = useCrud({
	service: service.task.info,
	dict: {
		api: {
			page: "log"
		}
	}
});

// 打开
function open(data: Eps.TaskInfoEntity) {
	visible.value = true;
	title.value = `日志列表（${data.name}）`;

	nextTick(() => {
		Crud.value?.refresh({ id: data.id, page: 1 });
	});
}

// 关闭
function close() {
	visible.value = false;
}

defineExpose({
	open,
	close
});
</script>
