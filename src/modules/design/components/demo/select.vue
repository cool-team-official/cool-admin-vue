<template>
	<div class="demo-select">
		<div class="item" v-for="(item, index) in Form?.form.options" :key="index">
			<el-input v-model="item.label" :placeholder="`请输入选项${index + 1}`" />
			<el-icon @click="add(index)"><circle-plus /></el-icon>
			<el-icon @click="del(index)"><remove /></el-icon>
		</div>
	</div>
</template>

<script lang="ts" name="demo-select" setup>
import { useForm } from "@cool-vue/crud";
import { CirclePlus, Remove } from "@element-plus/icons-vue";
import { isEmpty } from "lodash-es";
import { onMounted } from "vue";

const Form = useForm();

function add(index: number) {
	Form.value?.form.options.splice(index + 1, 0, {
		label: ""
	});
}

function del(index: number) {
	Form.value?.form.options.splice(index, 1);
}

onMounted(() => {
	if (isEmpty(Form.value?.form.options)) {
		add(0);
	}
});
</script>

<style lang="scss" scoped>
.item {
	display: flex;
	align-items: center;
	margin-bottom: 10px;

	.el-input {
		margin-right: 5px;
	}

	.el-icon {
		margin: 0 5px;
		font-size: 16px;
		color: var(--color-primary);
		cursor: pointer;
	}
}
</style>
