<template>
	<div class="form">
		<div class="container">
			<dp :ref="setRefs('dp')" />
		</div>

		<div class="footer">
			<el-button @click="clear">清空</el-button>
			<el-button type="info" @click="save">保存草稿</el-button>
			<el-button type="success" @click="create">生成代码</el-button>
		</div>

		<cl-editor-preview title="代码预览" name="monaco" :ref="setRefs('preview')" />
	</div>
</template>

<script lang="ts" setup>
import { useCool } from "/@/cool";
import { ElMessage, ElMessageBox } from "element-plus";
import Dp from "../components/index.vue";

const { refs, setRefs } = useCool();

function save() {
	refs.dp.saveDraft();
	ElMessage.success("保存草稿成功");
}

function create() {
	refs.preview.open(refs.dp.getData());
}

function clear() {
	ElMessageBox.confirm("是否清空列表所有数据？", "提示", {
		type: "warning"
	})
		.then(() => {
			refs.dp.clear();
		})
		.catch(() => null);
}
</script>

<style lang="scss" scoped>
.form {
	background-color: #fff;
	position: relative;
	min-width: 1300px;
	height: 100%;
	overflow: hidden;

	.container {
		height: calc(100% - 80px);
	}

	.footer {
		display: flex;
		justify-content: center;
		padding-top: 20px;
		height: 80px;
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;
		border-top: 1px solid #ebeef5;
		z-index: 9;
	}
}
</style>
