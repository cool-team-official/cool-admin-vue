<template>
	<div class="demo__context-menu" @contextmenu="open">
		<el-button size="mini">打开右键菜单</el-button>
	</div>
</template>

<script lang="ts">
import { ContextMenu } from "@/crud";
import { ElMessage } from "element-plus";
import { defineComponent } from "vue";

export default defineComponent({
	name: "demo__context-menu",

	setup() {
		function open(event: any) {
			ContextMenu.open(event, {
				list: [
					{
						label: "新增",
						"suffix-icon": "el-icon-plus",
						callback: (_: any, done: Function) => {
							ElMessage.success("点击了新增");
							done();
						}
					},
					{
						label: "编辑",
						"suffix-icon": "el-icon-edit",
						callback: (_: any, done: Function) => {
							ElMessage.success("点击了编辑");
							done();
						}
					},
					{
						label: "删除",
						"suffix-icon": "el-icon-delete",
						callback: (_: any, done: Function) => {
							ElMessage.error("点击了删除");
							done();
						}
					},
					{
						label: "二级",
						"suffix-icon": "el-icon-right",
						children: [
							{
								label: "文本超出隐藏，有一天晚上",
								ellipsis: true
							},
							{
								label: "禁用",
								disabled: true
							},
							{
								label: "更多",
								children: [
									{
										label: "空空如也",
										callback: (_: any, done: Function) => {
											done();
										}
									}
								]
							}
						]
					}
				]
			});
		}

		return {
			open
		};
	}
});
</script>

<style lang="scss" scoped>
.demo__context-menu {
	margin-left: 10px;
}
</style>
