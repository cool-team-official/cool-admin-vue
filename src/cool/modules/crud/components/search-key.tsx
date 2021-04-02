import { Crud } from "/@/cool/modules/crud/types";
import { defineComponent, inject, ref } from "vue";

export default defineComponent({
	name: "cl-search-key",

	props: {
		// 绑定值
		modelValue: String,
		// 选中字段
		field: {
			type: String,
			default: "keyWord"
		},
		// 字段列表
		fieldList: {
			type: Array,
			default: () => []
		},
		// 搜索时的钩子
		onSearch: Function,
		// 输入框占位内容
		placeholder: {
			type: String,
			default: "请输入关键字"
		}
	},

	emits: ["update:modelValue", "change", "field-change"],

	setup(props, { emit }) {
		const crud = inject("crud") as Crud;

		// 选中字段
		const selectField = ref<string>(props.field);

		// 搜索内容
		const value = ref<string>(props.modelValue || "");

		// 搜索
		function search() {
			const params: any = {};

			props.fieldList.forEach((e: any) => {
				params[e.value] = null;
			});

			function next(newParams?: any) {
				crud.refresh({
					page: 1,
					...params,
					[selectField.value]: value.value,
					...newParams
				});
			}

			if (props.onSearch) {
				props.onSearch(params, { next });
			} else {
				next();
			}
		}

		// 回车搜索
		function onKeydown({ keyCode }: any) {
			if (keyCode === 13) {
				search();
			}
		}

		// 监听输入
		function onInput(val: string) {
			emit("update:modelValue", val);
			emit("change", val);
		}

		// 监听字段选择
		function onFieldChange() {
			emit("field-change", selectField.value);
			onInput("");
			value.value = "";
		}

		return {
			value,
			selectField,
			search,
			onKeydown,
			onInput,
			onFieldChange
		};
	},

	render(ctx: any) {
		return (
			<div class="cl-search-key">
				<el-select
					class="cl-search-key__select"
					filterable
					size="mini"
					v-model={ctx.selectField}
					v-show={ctx.fieldList.length > 0}
					onChange={ctx.onFieldChange}>
					{ctx.fieldList.map((e: any, i: number) => (
						<el-option key={i} label={e.label} value={e.value} />
					))}
				</el-select>

				<el-input
					class="cl-search-key__input"
					v-model={ctx.value}
					placeholder={ctx.placeholder}
					onKeydown={ctx.onKeydown}
					onInput={ctx.onInput}
					clearable
					size="mini"
				/>

				<el-button
					class="cl-search-key__button"
					type="primary"
					size="mini"
					onClick={ctx.search}>
					搜索
				</el-button>
			</div>
		);
	}
});
