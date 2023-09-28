import { defineComponent, getCurrentInstance, inject, provide, reactive } from "vue";
import { cloneDeep } from "lodash-es";
import { useHelper } from "./helper";
import { Mitt } from "../../utils/mitt";
import { mergeConfig, merge } from "../../utils";
import { crudList } from "../../emitter";
import { useConfig } from "../../hooks";

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
		// 当前实例
		const inst = getCurrentInstance();

		// 配置
		const config = reactive<ClCrud.Config>(mergeConfig(inject("useCrud__options") || {}));

		// 事件
		const mitt = new Mitt(inst?.uid);

		// 全局配置
		const { dict, permission } = useConfig();

		// 参数
		const crud = reactive(
			merge(
				{
					id: props.name || inst?.uid,
					// 绑定的路由地址
					routePath: location.pathname || "/",
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

		// 追加参数
		merge(crud, useHelper({ config, crud, mitt }));

		// 集合
		crudList.push(crud);

		// 值穿透
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
