<template>
	<div class="scope">
		<div class="h">
			<span>cl-context-menu</span>
			右键菜单
		</div>
		<div class="c">
			<p class="btn" @contextmenu.stop.prevent="open">右键点击</p>
		</div>
		<div class="f">
			<span class="date">2019/10/23</span>
		</div>
	</div>
</template>

<script>
export default {
	methods: {
		open(e) {
			this.$crud.openContextMenu(e, {
				list: [
					{
						label: "新增",
						"suffix-icon": "el-icon-plus",
						callback: (_, done) => {
							this.$message.info("点击了新增");
							done();
						}
					},
					{
						label: "编辑",
						"suffix-icon": "el-icon-edit",
						callback: (_, done) => {
							this.$message.info("点击了编辑");
							done();
						}
					},
					{
						label: "删除",
						"suffix-icon": "el-icon-delete"
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
								callback: (_, done) => {
									this.$message.warning("开发中");
									done();
								}
							}
						]
					}
				]
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scope {
	.btn {
		border: 1px solid #dcdfe6;
		font-size: 13px;
		display: inline-block;
		padding: 5px 10px;
		cursor: pointer;
		border-radius: 3px;
	}
}
</style>
