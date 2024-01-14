<template>
	<div>
		<div>CRUD v7.0.0</div>

		<cl-crud>
			<cl-add-btn />

			<cl-upsert ref="Upsert"></cl-upsert>
		</cl-crud>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTable, useForm, useSearch, useUpsert, useAdvSearch } from "./hooks";
// Test

interface Data {
	name?: string;
	age?: number;
	formatter?(): string;
	[key: string]: any;
}

type Form = {
	data?: Data;
	list?: Data[] | (() => any)[];
};

function useF<T>(options: Form): Form {
	return options;
}

const form = useF({
	list: [
		{
			name: "A"
		},
		() => {
			return {
				name: form.data?.age == 12 ? "A" : "B"
			};
		}
	]
});

const Table = useTable<Data>({
	columns: [
		{
			label: "xx",
			prop: "a"
		}
	]
});

const Form = useForm<Data>();

Form.value?.open({
	items: [
		{
			type: "tabs",
			prop: "age"
		}
	]
});

const Upsert = useUpsert<Data>({
	items: [
		{
			label: "xx",
			prop: "age",
			component: {
				name: "el-input"
			}
		},
		() => {
			return {
				hidden: Upsert.value?.mode == "add",
				label: "x"
			};
		}
	]
});

const Search = useSearch<Data>({
	items: [
		{
			label: "xx",
			prop: "age"
		}
	]
});

const AdvSearch = useAdvSearch<Data>({
	items: [
		{
			label: "xx",
			prop: "age"
		}
	]
});
</script>
