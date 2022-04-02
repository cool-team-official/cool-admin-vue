<template>
	<el-popover
		v-model:visible="visible"
		placement="bottom-start"
		width="660px"
		popper-class="icon-check"
	>
		<el-row :gutter="10" class="list scroller1">
			<el-col v-for="(item, index) in list" :key="index" :span="2" :xs="4">
				<el-button :class="{ 'is-active': item === name }" @click="onChange(item)">
					<icon-svg :name="item" />
				</el-button>
			</el-col>
		</el-row>

		<template #reference>
			<el-input
				v-model="name"
				placeholder="请选择"
				clearable
				@click="open"
				@input="onChange"
			/>
		</template>
	</el-popover>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { iconList } from "/$/base";

export default defineComponent({
	name: "icon-check",

	props: {
		modelValue: {
			type: String,
			default: ""
		}
	},

	emits: ["update:modelValue"],

	setup(props, { emit }) {
		// 是否可见
		const visible = ref<boolean>(false);

		// 图标列表
		const list = ref<any[]>(iconList());

		// 已选图标
		const name = ref<string>(props.modelValue);

		watch(
			() => props.modelValue,
			(val) => {
				name.value = val;
			}
		);

		function open() {
			visible.value = true;
		}

		function close() {
			visible.value = false;
		}

		function onChange(val: string) {
			emit("update:modelValue", val);
			close();
		}

		return {
			name,
			list,
			visible,
			open,
			close,
			onChange
		};
	}
});
</script>

.
<style lang="scss">
.icon-check {
	box-sizing: border-box;

	.el-button {
		margin-bottom: 10px;
		height: 40px;
		width: 100%;
		padding: 0;

		.icon-svg {
			font-size: 18px;
			color: #444;
		}
	}
}
</style>
