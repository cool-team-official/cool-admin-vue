<template>
	<div class="c">
		<!-- <el-button @click="submit">submit</el-button> -->
		{{ Form?.form.t2.name }} - {{ disabled }}
		<el-input v-model="val" @input="onChange"></el-input>
		<el-button @click="add">a</el-button>
		<el-button @click="remove">b</el-button>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useForm, useUpsert } from "../hooks";

const props = defineProps({
	modelValue: Object,
	title: String,
	scope: null,
	column: null,
	disabled: Boolean
});

const emit = defineEmits(["update:modelValue"]);

const Upsert = useUpsert();
const Form = useForm();

const form = computed(() => Upsert.value?.form);

const val = ref<string>("");

function onChange(val: string) {
	emit("update:modelValue", val);
}

function add() {
	emit("update:modelValue", "1");
	Form.value?.validateField("test");
	console.log(Form.value?.getForm().name);
}

function remove() {
	emit("update:modelValue", "");
	Form.value?.validateField("test");
}
</script>
