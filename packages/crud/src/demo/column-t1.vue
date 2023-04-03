<template>
	<div class="c">
		<el-button @click="show">显示名称</el-button>
		<el-button @click="hide">隐藏名称</el-button>
	</div>
</template>

<script lang="ts" setup>
import { useCrud, useTable } from "../hooks";

const Crud = useCrud();
const Table = useTable();

function refresh() {
	Crud.value?.refresh();
}

function hide() {
	Table.value?.hideColumn(["name"]);
}

function show() {
	Table.value?.showColumn(["name"]);
}
</script>
