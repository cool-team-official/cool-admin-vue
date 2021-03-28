import {
	defineComponent,
	getCurrentInstance,
	inject,
	onMounted,
	provide,
	reactive,
	ref
} from "vue";
import Mitt from "../../utils/mitt";
import { useMitt, useRequest } from "./helper";
import { bootstap } from "./app";
import { deepMerge } from "@/core/utils";

export default defineComponent({
	name: "cl-crud",

	props: {
		name: String,
		border: Boolean,
		onDelete: Function,
		onRefresh: Function
	},

	emits: ["load"],

	setup(props, { emit }) {
		const ctx = getCurrentInstance();

		// 组件间通讯
		const mitt = new Mitt(ctx?.uid);

		// 配置
		const crud = reactive<any>({
			dict: {
				api: {
					list: "list",
					add: "add",
					update: "update",
					delete: "delete",
					info: "info",
					page: "page"
				},
				pagination: {
					page: "page",
					size: "size"
				},
				search: {
					keyWord: "keyWord",
					query: "query"
				},
				sort: {
					order: "order",
					prop: "prop"
				},
				label: {
					add: "新增",
					delete: "删除",
					multiDelete: "删除",
					update: "编辑",
					refresh: "刷新",
					advSearch: "高级搜索",
					saveButtonText: "保存",
					closeButtonText: "关闭"
				}
			},
			selection: [],
			table: {
				"context-menu": true
			},
			crudRef: ref<any>({}),
			service: {},
			loading: false,
			params: {
				page: 1,
				size: 20
			},
			permission: {
				update: true,
				page: true,
				info: true,
				list: true,
				add: true,
				delete: true
			}
		});

		// 集合
		Object.assign(crud, useMitt({ mitt }), useRequest({ mitt, props, crud }));

		// 临时处理方法
		const fn: any = {
			permission: null
		};

		// 提供
		provide("crud", crud);
		provide("mitt", mitt);

		onMounted(() => {
			// 加载完成回调
			emit("load", bootstap(deepMerge(crud, inject("__crud")), { fn }));

			// 监听窗口大小改变事件
			window.addEventListener("resize", () => {
				mitt.emit("crud.resize");
			});
		});

		return crud;
	},

	render(ctx: any) {
		return (
			<div class={["cl-crud", { "is-border": ctx.border }]} ref="crudRef">
				{ctx.$slots.default && ctx.$slots.default()}
			</div>
		);
	}
});
