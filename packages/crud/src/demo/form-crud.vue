<template>
	<el-button @click="open">内嵌crud</el-button>

	<cl-dialog v-model="visible" title="内嵌crud">
		<cl-crud name="22" ref="Crud" padding="0">
			<cl-row>
				<cl-refresh-btn></cl-refresh-btn>
				<btn />
			</cl-row>

			<cl-row>
				<cl-table :auto-height="false" ref="Table"></cl-table>
			</cl-row>

			<cl-row>
				<cl-pagination></cl-pagination>
			</cl-row>
		</cl-crud>
	</cl-dialog>
</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue";
import { useCrud, useRefs, useTable } from "../hooks";
import Btn from "./btn.vue";

const { refs, setRefs } = useRefs();

const Table = useTable({
	columns: [
		{
			label: "昵称",
			prop: "name"
		}
	]
});

const Crud = useCrud(
	{
		service: "test"
	},
	(app) => {
		app.refresh();
	}
);

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
