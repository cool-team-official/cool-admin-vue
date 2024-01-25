<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">event</el-tag>
			<span>事件</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['upsert/event.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="事件" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<!-- 打开新增表单的按钮 -->
						<cl-add-btn />
					</cl-row>

					<cl-row>
						<cl-table ref="Table" />
					</cl-row>

					<cl-row>
						<cl-flex1 />
						<cl-pagination />
					</cl-row>

					<!--【很重要】新增、编辑的表单组件 -->
					<cl-upsert ref="Upsert" />
				</cl-crud>
			</cl-dialog>
		</div>

		<div class="f">
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { ref } from "vue";
import { useDict } from "/$/dict";
import { useCool } from "/@/cool";

const { service } = useCool();
const { dict } = useDict();

// cl-crud 配置
const Crud = useCrud(
	{
		service: "test"
	},
	(app) => {
		app.refresh();
	}
);

// cl-table 配置
const Table = useTable({
	autoHeight: false,
	contextMenu: ["refresh"],

	columns: [
		{
			label: "姓名",
			prop: "name",
			minWidth: 140
		},
		{
			label: "手机号",
			prop: "phone",
			minWidth: 140
		},
		{
			label: "工作",
			prop: "occupation",
			dict: dict.get("occupation"),
			minWidth: 140
		},
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 160,
			sortable: "desc"
		},
		{
			type: "op",
			// edit 打开编辑表单
			buttons: ["edit", "delete"]
		}
	]
});

// cl-upsert 配置
const Upsert = useUpsert({
	items: [
		{
			label: "姓名",
			prop: "name",
			component: {
				name: "el-input"
			}
		},
		{
			label: "手机号",
			prop: "phone",
			component: {
				name: "el-input"
			}
		},
		{
			label: "工作",
			prop: "occupation",
			component: {
				name: "cl-select",
				props: {
					tree: true,
					checkStrictly: true,
					options: dict.get("occupation")
				}
			}
		}
	],

	// 以下事件按顺序触发

	// 弹窗打开的事件，这个时候还未有表单数据
	onOpen() {
		console.log("onOpen");
	},

	// 获取详情，编辑的时候会触发
	async onInfo(data, { next, done }) {
		// 不配置 onInfo 的时候默认执行 next(data)，调用 service 的 info 接口获取详情
		// next(data);

		// 自定义，需要对请求数据进行处理或者返回处理后的数据
		const res = await next({
			id: data.id
		});

		done({
			...res,
			name: `[${res.name}]`
		});
	},

	// 弹窗打开后，已经得到了表单数据
	onOpened(data) {
		// 判定是否编辑模式
		if (Upsert.value?.mode == "update") {
			// 对数据处理
			data.phone += "000";
		}
	},

	// 提交事件的钩子
	// data 表单提交数据
	// next 继续往下执行
	// done 关闭加载
	// close 关闭弹窗
	async onSubmit(data, { next, done, close }) {
		// 不配置 onSubmit 的时候默认执行 next(data)，提交后会去请求 service 的 update/add 接口
		// next(data);

		// 自定义如下
		// 场景1：提交时对参数额外的处理
		// next({
		// 	...data,
		// 	status: 1,
		// 	createTime: dayjs().format("YYYY-MM-DD")
		// });

		// 场景2：提交前、后的操作
		// 之前，模拟获取 userId
		const userId = await service.test.info({ id: 1 });

		// 返回值
		const res = await next({
			userId,
			data
		});

		// 之后
		// console.log(res);
	},

	// 关闭时触发
	onClose(action, done) {
		// action 关闭的类型
		console.log("action，", action);

		// 使用 done 关闭窗口
		done();
	},

	// 关闭后触发
	onClosed() {
		console.log("onClosed");
	}
});

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
