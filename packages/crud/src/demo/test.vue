<template>
	<el-row type="flex">
		<el-input v-model="form.test" @input="onChange"></el-input>
		<el-button @click="change">change</el-button>
		<el-button @click="refresh">refresh</el-button>
	</el-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCrud, useForm, useUpsert } from "../hooks";

export default defineComponent({
	name: "test",

	props: {
		modelValue: String
	},

	setup(props, { emit }) {
		const Form = useForm();
		const Crud = useCrud();

		useUpsert({
			onOpened(data) {
				console.log(data);
			}
		});

		function change() {
			Form.value?.setForm("name", "🐑");
		}

		function reset() {
			Form.value?.clear();
		}

		function refresh() {
			Form.value?.close();
			Crud.value?.refresh();
		}

		function onChange(val: string) {
			console.log(val);
			emit("update:modelValue", val);
			emit("change", val);
		}

		return {
			form: Form.value?.form,
			change,
			reset,
			refresh,
			onChange
		};
	}
});
</script>
