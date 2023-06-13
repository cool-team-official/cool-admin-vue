import { defineComponent, getCurrentInstance, inject, provide, reactive } from "vue";
import { merge } from "merge";
import { useHelper } from "./helper";
import Mitt from "../../utils/mitt";
import { cloneDeep, deepMerge, mergeConfig } from "../../utils";
import { crudList } from "../../emitter";
import { useGlobal } from "../../hooks";

export default defineComponent({
	name: "cl-crud",

	props: {
		// 组件名
		name: String,
		// 是否有边框
		border: Boolean,
		// 内间距
		padding: {
			type: String,
			default: "10px"
		}
	},

	setup(props, { slots, expose }) {
		const { uid }: any = getCurrentInstance();

		// 配置
		const config = reactive<ClCrud.Config>(mergeConfig(inject("useCrud__options") || {}));

		// 组件间通讯
		const mitt = new Mitt(uid);

		// 全局配置
		const { dict, permission } = useGlobal();

		// 参数
		const crud = reactive(
			deepMerge(
				{
					id: props.name || uid,
					// 绑定的路由地址
					routePath: location.pathname || "/",
					// 表格配置
					table: {
						contextMenu: true,
						border: true
					},
					// 表格加载状态
					loading: false,
					// 表格已选列
					selection: [],
					// 请求参数
					params: {
						page: 1,
						size: 20
					},
					// 请求服务
					service: {},
					// 字典
					dict: {},
					// 权限
					permission: {}
				},
				cloneDeep({ dict, permission })
			)
		);

		// 集合
		crudList.push(merge(crud, useHelper({ mitt, config, crud })));

		// 提供
		provide("crud", crud);
		provide("mitt", mitt);

		// 导出
		expose(crud);

		return () => {
			return (
				<div
					class={["cl-crud", { "is-border": props.border }]}
					style={{ padding: props.padding }}>
					{slots.default?.()}
				</div>
			);
		};
	}
});
