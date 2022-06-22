<template>
	<div class="cl-column-custom__wrap">
		<el-button @click="open">自定义列</el-button>

		<cl-dialog v-model="visible" title="自定义列">
			<div class="cl-column-custom__dialog">
				<div class="left">
					<el-checkbox-group v-model="selection">
						<el-checkbox
							v-for="(item, index) in list"
							:key="index"
							:label="item.value"
							>{{ item.label }}</el-checkbox
						>
					</el-checkbox-group>
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
import { computed, defineComponent, onMounted, ref } from "vue";
import { useCrud } from "@cool-vue/crud";
import store from "store";

export default defineComponent({
	name: "cl-column-custom",

	props: {
		name: String,
		columns: {
			type: Array,
			default: () => []
		}
	},

	setup(props) {
		// cl-crud
		const Crud = useCrud();

		// 是否可见
		const visible = ref(false);

		// 选中
		const selection = ref([]);

		// 名称
		const name = `column-custom__${props.name || location.pathname}`;

		// 列数据
		const list = computed(() => {
			return props.columns
				.filter((e: any) => !e.type)
				.map((e: any) => {
					return {
						label: e.label,
						value: e.prop
					};
				});
		});

		// 获取 prop
		function getNames() {
			const arr = store.get(name);
			return arr ? arr : list.value.map((e) => e.value);
		}

		// 改变列
		function change() {
			const names = getNames();

			if (store.get(name)) {
				Crud.value?.Table.reBuild(() => {
					props.columns.map((e: any) => {
						if (!e.type) {
							e.hidden = !names.includes(e.prop);
						}
					});
				});
			}
		}

		// 保存
		function save() {
			store.set(name, selection.value);
			change();
			close();
		}

		// 打开
		function open() {
			selection.value = getNames();
			visible.value = true;
		}

		// 关闭
		function close() {
			visible.value = false;
		}

		onMounted(() => {
			change();
		});

		return {
			visible,
			list,
			selection,
			open,
			close,
			save
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-column-custom {
	&__dialog {
		.left {
		}

		.right {
			border-left: 1px solid #eee;
		}
	}
}
</style>
