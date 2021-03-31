<template>
	<div class="demo">
		<cl-crud @load="onLoad">
			<el-row>
				<cl-refresh-btn></cl-refresh-btn>
				<cl-add-btn></cl-add-btn>
				<cl-multi-delete-btn></cl-multi-delete-btn>
				<demo-dialog></demo-dialog>
				<demo-context-menu></demo-context-menu>
				<demo-form></demo-form>
				<demo-query></demo-query>
				<cl-flex1></cl-flex1>
				<cl-search-key field="name"></cl-search-key>
				<demo-adv-search></demo-adv-search>
			</el-row>

			<el-row>
				<demo-table></demo-table>
			</el-row>

			<el-row>
				<cl-flex1></cl-flex1>
				<cl-pagination></cl-pagination>
			</el-row>

			<demo-upsert></demo-upsert>
		</cl-crud>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CrudLoad } from "@/crud/types";
import { TestService } from "../utils/service";
import Dialog from "../components/crud/dialog.vue";
import ContextMenu from "../components/crud/context-menu.vue";
import Query from "../components/crud/query.vue";
import AdvSearch from "../components/crud/adv-search.vue";
import Table from "../components/crud/table.vue";
import Upsert from "../components/crud/upsert.vue";
import Form from "../components/crud/form.vue";

export default defineComponent({
	name: "crud",

	components: {
		"demo-dialog": Dialog,
		"demo-context-menu": ContextMenu,
		"demo-query": Query,
		"demo-adv-search": AdvSearch,
		"demo-table": Table,
		"demo-upsert": Upsert,
		"demo-form": Form
	},

	setup() {
		function onLoad({ ctx, app }: CrudLoad) {
			ctx.service(TestService).done();
			app.refresh();
		}

		return {
			onLoad
		};
	}
});
</script>

<style lang="scss">
html,
body,
#app,
.demo {
	height: 100%;
	overflow: hidden;
}

* {
	padding: 0;
	margin: 0;
}
</style>
