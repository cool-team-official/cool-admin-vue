<template>
	<div>CRUD v7.0.0</div>
</template>

<script setup lang="ts">
import { useTable, useForm, useSearch, useUpsert, useAdvSearch } from "./hooks";
// Test

interface Data {
	name?: string;
	age?: string;
	[key: string]: any;
}

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
			prop: "age"
		}
	],
	onOpened(data) {
		data.name = "";
	},
	onInfo(data) {},
	onSubmit(data) {}
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
