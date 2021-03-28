import { defineComponent, nextTick, onMounted, reactive, ref } from "vue";
import { useRefs } from "../hooks/core";
import { isArray, isEmpty } from "../utils";

export default defineComponent({
	name: "cl-form-tabs",

	props: {
		modelValue: [String, Number],
		labels: {
			type: Array,
			default: () => []
		},
		justify: {
			type: String,
			default: "center"
		},
		color: {
			type: String,
			default: "#409EFF"
		}
	},

	emits: ["update:modelValue", "change"],

	setup(props, { emit }) {
		const { refs, setRefs }: any = useRefs();

		// 标识
		const active = ref<any>("");

		// 切换列表
		const list = ref<any[]>([]);

		// 下划线
		const line = reactive<any>({
			width: "",
			offsetLeft: ""
		});

		function update(val: string | number) {
			nextTick(() => {
				const index = list.value.findIndex(e => e.value === val);
				const item = refs.value[`tab-${index}`];

				// 下划线位置
				line.width = item.clientWidth + "px";
				line.transform = `translateX(${item.offsetLeft}px)`;
				line.backgroundColor = props.color;

				// 靠左位置
				let left: number = item.offsetLeft + item.clientWidth / 2 - 414 / 2 + 15;

				if (left < 0) {
					left = 0;
				}

				// 设置滚动距离
				refs.value.tabs.scrollLeft = left;
			});

			active.value = val;
			emit("update:modelValue", val);
			emit("change", val);
		}

		onMounted(function() {
			if (isArray(props.labels) && props.labels.length > 0) {
				list.value = props.labels;
				update(isEmpty(props.modelValue) ? list.value[0].value : props.modelValue);
			}
		});

		return {
			active,
			list,
			line,
			refs,
			setRefs,
			update
		};
	},

	render(ctx: any) {
		return (
			<div class="cl-form-tabs">
				<ul style={{ textAlign: ctx.justify }} ref={ctx.setRefs("tabs")}>
					{ctx.list.map((e: any, i: number) => {
						return (
							<li
								ref={ctx.setRefs(`tab-${i}`)}
								class={{ "is-active": e.value === ctx.active }}
								style={{
									color: e.value === ctx.active ? ctx.color : "#444"
								}}
								onClick={() => {
									ctx.update(e.value);
								}}>
								{e.label}
							</li>
						);
					})}

					{ctx.line.width && <div class="cl-form-tabs__line" style={ctx.line}></div>}
				</ul>
			</div>
		);
	}
});
