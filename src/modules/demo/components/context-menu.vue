<template>
	<div class="scope">
		<div class="h">
			<span>cl-context-menu</span>
			右键菜单
		</div>
		<div class="c">
			<el-button type="success" @contextmenu.stop.prevent="open">右键点击</el-button>
		</div>
		<div class="f">
			<span class="date">2019/10/23</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ContextMenu } from "@cool-vue/crud";
import { ElMessage } from "element-plus";

function open(e: any) {
	ContextMenu.open(e, {
		list: [
			{
				label: "新增",
				suffixIcon: "el-icon-plus",
				callback(done) {
					ElMessage.info("点击了新增");
					done();
				}
			},
			{
				label: "编辑",
				suffixIcon: "el-icon-edit",
				callback(done) {
					ElMessage.info("点击了编辑");
					done();
				}
			},
			{
				label: "删除",
				suffixIcon: "el-icon-delete"
			},
			{
				label: "二级",
				suffixIcon: "el-icon-right",
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
						callback(done) {
							ElMessage.warning("开发中");
							done();
						}
					}
				]
			}
		]
	});
}
</script>
