<template>
	<div class="demo-group">
		<div class="head" v-show="label">{{ label }}</div>

		<draggable
			v-model="list"
			class="list"
			tag="div"
			item-key="id"
			:group="{
				name: 'A',
				animation: 300,
				ghostClass: 'Ghost',
				dragClass: 'Drag',
				draggable: '.is-drag',
				put: isPut
			}"
			:clone="onClone"
		>
			<template #footer>
				<div class="tips">可拖入多个组件<span>（不包含组合组件）</span></div>
			</template>

			<template #item="{ element: item, index }">
				<div
					class="item"
					:class="{
						active: dp.form.active == item.id
					}"
					@click.stop="dp.toDet(item)"
				>
					<el-icon
						class="close"
						@click.stop="remove(index)"
						v-show="dp.form.active == item.id && item.isDel !== false"
					>
						<close-bold />
					</el-icon>

					<component
						:is="item.component.name"
						:data="item"
						v-bind="item.component.props"
					/>
				</div>
			</template>
		</draggable>
	</div>
</template>

<script lang="ts" setup name="demo-group">
import { ref, watch } from "vue";
import Draggable from "vuedraggable/src/vuedraggable";
import { CloseBold } from "@element-plus/icons-vue";
import { useCool } from "/@/cool";
import { useDp } from "../../hooks";

const props = defineProps({
	label: String,
	children: Array
});

const emit = defineEmits(["update:children"]);

const { mitt } = useCool();
const { dp } = useDp();

const list = ref<any[]>(props.children || []);
const isPut = ref(true);

function remove(index: number) {
	dp.clearConfig(list.value[index].id);
	list.value?.splice(index, 1);
}

function onClone(data: any) {
	mitt.emit("dp.pull", data);
	return data;
}

mitt.on("dp.setActive", (id: string) => {
	const d = list.value?.find((e) => e.id == id);
	if (d) {
		dp.toDet(d);
	}
});

mitt.on("dp.pull", (d) => {
	isPut.value = d?.component.name != "demo-group";
});

watch(
	list,
	(val) => {
		emit("update:children", val);
	},
	{
		deep: true
	}
);
</script>

<style lang="scss" scoped>
.demo-group {
	background-color: #fff;

	.head {
		line-height: 40px;
		height: 40px;
		padding: 0 12px;
		font-size: 14px;
		font-weight: bold;
	}

	.list {
		background-color: #d9effe;

		.tips {
			color: #8c8c8c;
			font-size: 12px;
			padding: 15px;
		}

		.item {
			&:nth-last-child(2) {
				margin-bottom: 0;
			}
		}
	}
}
</style>
