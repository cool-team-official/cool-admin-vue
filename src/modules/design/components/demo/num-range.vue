<template>
	<div class="num-range">
		<el-input-number v-model="v[0]" :max="v[1]" @change="onChange" />
		<span>至</span>
		<el-input-number v-model="v[1]" :min="v[0]" @change="onChange" />
	</div>
</template>

<script lang="ts" setup name="demo-num-range">
import { ref } from "vue";

const props = defineProps({
	modelValue: Array
});

const emit = defineEmits(["update:modelValue"]);

const v = ref<any[]>(props.modelValue || []);

function onChange() {
	emit("update:modelValue", v.value);
}
</script>

<style lang="scss" scoped>
.num-range {
	display: flex;
	align-items: center;

	.el-input {
		flex: 1;
	}

	span {
		margin: 0 10px;
	}
}
</style>
