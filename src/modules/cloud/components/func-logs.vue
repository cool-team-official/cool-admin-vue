<template>
	<cl-dialog v-model="visible" :title="title" width="1200px">
		<cl-crud ref="Crud" padding="0">
			<cl-row>
				<!-- 刷新按钮 -->
				<cl-refresh-btn />
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
import { nextTick, ref } from "vue";
import { LogType } from "../dict";
import { useCool } from "/@/cool";

const { service } = useCool();

// 是否可见
const visible = ref(false);

// 标题
const title = ref("");

// cl-table
const Table = useTable({
	autoHeight: false,
	columns: [
		{
			label: "#",
			type: "index"
		},
		{
			label: "请求",
			prop: "request",
			minWidth: 150,
			component: {
				name: "cl-code-json",
				props: {
					popover: true
				}
			}
		},
		{
			label: "耗时",
			prop: "time",
			minWidth: 100,
			formatter(row) {
				return row.time + "ms";
			}
		},
		{
			label: "结果",
			prop: "result",
			minWidth: 150,
			component: {
				name: "cl-code-json",
				props: {
					popover: true
				}
			}
		},
		{
			label: "类型",
			prop: "type",
			minWidth: 100,
			dict: LogType
		},
		{
			label: "异常信息",
			prop: "error",
			minWidth: 150,
			showOverflowTooltip: true
		},
		{
			label: "执行时间",
			prop: "createTime",
			minWidth: 160,
			sortable: "desc"
		}
	]
});

// cl-crud
const Crud = useCrud({
	service: service.cloud.func.log
});

// 打开
function open(data: Eps.CloudFuncInfoEntity) {
	visible.value = true;
	title.value = `日志列表（${data.name}）`;

	nextTick(() => {
		Crud.value?.refresh({
			page: 1,
			infoId: data.id
		});
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
