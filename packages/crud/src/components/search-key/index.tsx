import { defineComponent, ref, watch, computed, PropType } from "vue";
import { useConfig, useCore } from "../../hooks";
import { parsePx } from "../../utils";

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
			type: Array as PropType<Array<{ label: string; value: string }>>,
			default: () => []
		},
		// 搜索时的钩子
		onSearch: Function,
		// 输入框占位内容
		placeholder: String,
		// 宽度
		width: {
			type: [String, Number],
			default: 300
		}
	},

	emits: ["update:modelValue", "change", "field-change"],

	setup(props, { emit, expose }) {
		const { crud } = useCore();
		const { style } = useConfig();

		// 选中字段
		const selectField = ref(props.field);

		// 加载状态
		const loading = ref(false);

		// 文字提示
		const placeholder = computed(() => {
			if (props.placeholder) {
				return props.placeholder;
			} else {
				const item = props.fieldList.find((e) => e.value == selectField.value);

				if (item) {
					return crud.dict.label.placeholder + item.label;
				} else {
					return crud.dict.label.searchKey;
				}
			}
		});

		// 搜索内容
		const value = ref("");

		watch(
			() => props.modelValue,
			(val) => {
				value.value = val || "";
			},
			{
				immediate: true
			}
		);

		// 锁
		let lock = false;

		// 搜索
		function search() {
			if (!lock) {
				const params: obj = {};

				props.fieldList.forEach((e) => {
					params[e.value] = undefined;
				});

				async function next(newParams?: obj) {
					loading.value = true;

					await crud.refresh({
						page: 1,
						...params,
						[selectField.value]: value.value || undefined,
						...newParams
					});

					loading.value = false;
				}

				if (props.onSearch) {
					props.onSearch(params, { next });
				} else {
					next();
				}
			}
		}

		// 回车搜索
		function onKeydown({ key }: KeyboardEvent) {
			if (key === "Enter") {
				search();
			}
		}

		// 监听输入
		function onInput(val: string) {
			emit("update:modelValue", val);
			emit("change", val);
		}

		// 监听变化
		function onChange() {
			search();
			lock = true;

			setTimeout(() => {
				lock = false;
			}, 300);
		}

		// 监听字段选择
		function onFieldChange() {
			emit("field-change", selectField.value);
			onInput("");
			value.value = "";
		}

		expose({
			search
		});

		return () => {
			return (
				<div class="cl-search-key">
					<el-select
						class="cl-search-key__select"
						filterable
						size={style.size}
						v-model={selectField.value}
						v-show={props.fieldList.length > 0}
						onChange={onFieldChange}>
						{props.fieldList.map((e, i) => (
							<el-option key={i} label={e.label} value={e.value} />
						))}
					</el-select>

					<div class="cl-search-key__wrap" style={{ width: parsePx(props.width) }}>
						<el-input
							v-model={value.value}
							size={style.size}
							placeholder={placeholder.value}
							onKeydown={onKeydown}
							onInput={onInput}
							onChange={onChange}
							clearable
						/>

						<el-button
							size={style.size}
							type="primary"
							loading={loading.value}
							onClick={search}>
							{crud.dict.label.search}
						</el-button>
					</div>
				</div>
			);
		};
	}
});
