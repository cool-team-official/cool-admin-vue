<template>
	<div class="demo-checkbox">
		<el-checkbox v-model="value" @change="onChange"
			>{{ text }} <span class="tips">{{ tips }}</span></el-checkbox
		>
	</div>
</template>

<script lang="ts" name="demo-checkbox" setup>
import { ref } from "vue";

const props = defineProps({
	modelValue: Boolean,
	text: String,
	tips: String
});

const emit = defineEmits(["update:modelValue"]);

const value = ref(props.modelValue);

function onChange() {
	emit("update:modelValue", value.value);
}
</script>

<style lang="scss" scoped>
.demo-checkbox {
	.tips {
		font-size: 12px;
		color: #bfbfbf;
	}
}
</style>
