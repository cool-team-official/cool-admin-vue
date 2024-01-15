<template>
	<div>
		<div>CRUD DEMO v7.0.0</div>

		<cl-crud>
			<cl-add-btn />
			<cl-upsert ref="Upsert"></cl-upsert>
		</cl-crud>
	</div>
</template>

<script setup lang="tsx">
import { useTable, useForm, useSearch, useUpsert, useAdvSearch } from "./hooks";

interface Data {
	name?: string;
	age?: number;
	[key: string]: any;
}

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
	],
	onOpened(data) {}
});

const Table = useTable<Data>({
	columns: [
		{
			label: "xx",
			prop: "a",
			search: {
				component: {
					name: "el-date-picker"
				}
			}
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
