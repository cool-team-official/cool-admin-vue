import {
	defineComponent,
	h,
	nextTick,
	onMounted,
	PropType,
	reactive,
	ref,
	toRaw,
	watch
} from "vue";
import { isEmpty } from "lodash-es";
import { useRefs, useDialog } from "../../hooks";

export default defineComponent({
	name: "cl-form-tabs",

	props: {
		modelValue: [String, Number],
		labels: {
			type: Array,
			default: () => []
		},
		justify: {
			type: String as PropType<
				"start" | "end" | "left" | "right" | "center" | "justify" | "match-parent"
			>,
			default: "center"
		},
		type: {
			type: String as PropType<"card" | "default">,
			default: "default"
		}
	},

	emits: ["update:modelValue", "change"],

	setup(props, { emit, expose }) {
		const { refs, setRefs } = useRefs();

		// 标识
		const active = ref("");

		// 切换列表
		const list = ref<any[]>([]);

		// 下划线
		const line = reactive({
			width: "",
			offsetLeft: "",
			transform: "",
			backgroundColor: ""
		});

		function update(val: any) {
			if (!val) {
				return false;
			}

			nextTick(() => {
				const index = list.value.findIndex((e) => e.value === val);
				const item = refs[`tab-${index}`];

				if (item) {
					// 下划线位置
					line.width = item.offsetWidth + "px";
					line.transform = `translateX(${item.offsetLeft}px)`;

					// 靠左位置
					let left = item.offsetLeft + item.clientWidth / 2 - 414 / 2 + 15;

					if (left < 0) {
						left = 0;
					}

					// 设置滚动距离
					refs.tabs.scrollLeft = left;
				}
			});

			active.value = val;
			emit("update:modelValue", val);
		}

		// 监听绑定值变化
		watch(() => props.modelValue, update);

		// 监听值修改
		watch(
			() => active.value,
			(val) => {
				emit("change", val);
			}
		);

		useDialog({
			onFullscreen() {
				update(active.value);
			}
		});

		onMounted(function () {
			if (!isEmpty(props.labels)) {
				list.value = props.labels;
				update(isEmpty(props.modelValue) ? list.value[0].value : props.modelValue);
			}
		});

		expose({
			active,
			list,
			line,
			update
		});

		return () => {
			return (
				<div class={["cl-form-tabs", `cl-form-tabs--${props.type}`]}>
					<div
						class="cl-form-tabs__wrap"
						style={{ textAlign: props.justify }}
						ref={setRefs("tabs")}>
						<ul>
							{list.value.map((e, i) => {
								return (
									<li
										ref={setRefs(`tab-${i}`)}
										class={{ "is-active": e.value === active.value }}
										onClick={() => {
											update(e.value);
										}}>
										{e.icon && <el-icon>{h(toRaw(e.icon))}</el-icon>}
										<span>{e.label}</span>
									</li>
								);
							})}

							{line.width && <div class="cl-form-tabs__line" style={line}></div>}
						</ul>
					</div>
				</div>
			);
		};
	}
});
