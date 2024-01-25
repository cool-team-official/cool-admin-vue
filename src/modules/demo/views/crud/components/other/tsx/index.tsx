import { defineComponent, ref } from "vue";
import { Check } from "@element-plus/icons-vue";
import "./index.scss";

interface Item {
	name: string;
	value: number;
}

export default defineComponent({
	emits: ["checked"],

	setup(props, { emit, expose, slots }) {
		// 列表数据
		const list = ref<Item[]>([
			{
				name: "鸡腿堡",
				value: 1
			},
			{
				name: "牛肉堡",
				value: 2
			}
		]);

		// 选择值
		const active = ref();

		// 是否可见
		const visible = ref(false);

		// 打开
		function open() {
			visible.value = true;
		}

		// 选择
		function toCheck(item: Item) {
			active.value = item.value;

			// 自定义事件
			emit("checked", item);
		}

		// 暴露方法和变量，使上级可以使用 ref 的方式来调用
		expose({
			toCheck
		});

		// 必须返回一个方法
		return () => {
			return (
				<div class="scope">
					<div class="h">
						<el-tag size="small" effect="dark">
							tsx
						</el-tag>
						<span>tsx示例</span>
					</div>

					<div class="c">
						<el-button onClick={open}>预览</el-button>
						<demo-code files={["other/tsx/index.tsx"]} />

						{/* ref 的绑定值必须 .value */}
						<cl-dialog v-model={visible.value} title="tsx示例">
							<div class="tsx-list">
								{/* 循环的使用 */}
								{list.value.map((item) => {
									// 插槽的使用
									return slots.default ? (
										slots.default(item)
									) : (
										<div
											// 动态样式的使用
											class={[
												"item",
												{ "is-active": item.value == active.value }
											]}
											// 事件的使用
											onClick={() => toCheck(item)}
										>
											<span>{item.name}</span>

											<el-icon>
												<Check />
											</el-icon>
										</div>
									);
								})}
							</div>
						</cl-dialog>
					</div>

					<div class="f">
						<span class="date">2024-01-01</span>
					</div>
				</div>
			);
		};
	}

	// 不推荐用该方法，在 setup 中返回模板信息
	// render() {
	// 	return <div></div>;
	// }
});
