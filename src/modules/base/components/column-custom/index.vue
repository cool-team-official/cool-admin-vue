<template>
	<div class="cl-column-custom__wrap">
		<el-button @click="open">自定义列</el-button>

		<cl-dialog v-model="visible" title="自定义列">
			<div class="cl-column-custom__dialog">
				<div class="left">
					<draggable v-model="list">
						<template #item="{ element: item }">
							<el-checkbox border v-model="item.checked">{{
								item.label
							}}</el-checkbox>
						</template>
					</draggable>
				</div>

				<div class="right"></div>
			</div>

			<template #footer>
				<el-button @click="close">取消</el-button>
				<el-button type="success" @click="save">保存</el-button>
			</template>
		</cl-dialog>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, nextTick, watch } from "vue";
import store from "store";
import Draggable from "vuedraggable/src/vuedraggable";
import { orderBy } from "lodash";

export default defineComponent({
	name: "cl-column-custom",

	props: {
		name: String,
		columns: {
			type: Array as PropType<any[]>,
			required: true,
			default: () => []
		}
	},

	components: {
		Draggable
	},

	setup(props) {
		// 是否可见
		const visible = ref(false);

		// 名称
		const name = `column-custom__${props.name || location.pathname}`;

		// 列数据
		const list = ref<{ label: string; prop: any; checked?: boolean; orderNum?: number }[]>([]);

		// 改变列
		function change() {
			nextTick(() => {
				props.columns.forEach((e) => {
					if (!e.type && e.prop) {
						e.hidden = !list.value.find((a) => a.prop == e.prop)?.checked;
						e.orderNum = list.value.findIndex((a) => a.prop == e.prop);
					}
				});
			});
		}

		// 保存
		function save() {
			store.set(name, list.value);
			change();
			close();
		}

		// 打开
		function open() {
			visible.value = true;
		}

		// 关闭
		function close() {
			visible.value = false;
		}

		watch(
			() => props.columns,
			(val) => {
				if (val) {
					const selection: any[] = store.get(name);

					list.value = orderBy(
						val
							.filter((e) => !e.type && e.prop)
							.map((e) => {
								return {
									label: e.label,
									prop: e.prop,
									checked: selection
										? selection.find((a) => a.prop == e.prop)?.checked
										: true,
									orderNum: selection
										? selection.findIndex((a) => a.prop == e.prop)
										: e.orderNum || 0
								};
							}),
						"orderNum",
						"asc"
					);

					change();
				}
			}
		);

		return {
			visible,
			list,
			open,
			close,
			save
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-column-custom {
	&__wrap {
		margin-left: 10px;
	}

	&__dialog {
		.left {
			.el-checkbox {
				margin-right: 10px;
			}
		}

		.right {
			border-left: 1px solid #eee;
		}
	}
}
</style>
