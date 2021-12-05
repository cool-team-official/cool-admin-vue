<template>
	<cl-crud :ref="setRefs('crud')" @load="onLoad">
		<el-row type="flex">
			<cl-refresh-btn />

			<el-button
				v-permission="service.base.sys.log.permission.clear"
				size="mini"
				type="danger"
				@click="clear"
			>
				清空
			</el-button>

			<cl-filter label="日志保存天数">
				<el-input-number
					v-model="day"
					controls-position="right"
					size="mini"
					:max="10000"
					:min="1"
					@blur="saveDay"
				/>
			</cl-filter>

			<cl-flex1 />
			<cl-search-key placeholder="请输入请求地址, 参数，ip地址" />
		</el-row>

		<el-row>
			<cl-table v-bind="table" />
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<cl-pagination />
		</el-row>
	</cl-crud>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useCool } from "/@/cool";
import { CrudLoad, Table } from "@cool-vue/crud/types";

export default defineComponent({
	name: "sys-log",

	setup() {
		const { refs, setRefs, service }: any = useCool();

		// 天数
		const day = ref<number>(1);

		// cl-table 配置
		const table = reactive<Table>({
			"context-menu": ["refresh"],
			props: {
				"default-sort": {
					prop: "createTime",
					order: "descending"
				}
			},
			columns: [
				{
					type: "index",
					label: "#",
					width: 60
				},
				{
					prop: "userId",
					label: "用户ID"
				},
				{
					prop: "name",
					label: "昵称",
					minWidth: 150
				},
				{
					prop: "action",
					label: "请求地址",
					minWidth: 200,
					showOverflowTooltip: true
				},
				{
					prop: "params",
					label: "参数",
					align: "center",
					minWidth: 200,
					showOverflowTooltip: true
				},
				{
					prop: "ip",
					label: "ip",
					minWidth: 180
				},
				{
					prop: "ipAddr",
					label: "ip地址",
					minWidth: 150
				},
				{
					prop: "createTime",
					label: "创建时间",
					minWidth: 150,
					sortable: true
				}
			]
		});

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			ctx.service(service.base.sys.log).done();
			app.refresh();
		}

		// 保存天数
		function saveDay() {
			service.base.sys.log.setKeep(day.value).then(() => {
				ElMessage.success("保存成功");
			});
		}

		// 清空日志
		function clear() {
			ElMessageBox.confirm("是否要清空日志", "提示", {
				type: "warning"
			})
				.then(() => {
					service.base.sys.log
						.clear()
						.then(() => {
							ElMessage.success("清空成功");
							refs.value.crud.refresh();
						})
						.catch((err: string) => {
							ElMessage.error(err);
						});
				})
				.catch(() => null);
		}

		// 获取天数
		service.base.sys.log.getKeep().then((res: number) => {
			day.value = Number(res);
		});

		return {
			service,
			refs,
			day,
			table,
			setRefs,
			onLoad,
			saveDay,
			clear
		};
	}
});
</script>
