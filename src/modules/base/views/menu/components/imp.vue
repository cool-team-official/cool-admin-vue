<template>
	<cl-upload
		type="file"
		:show-file-list="false"
		:auto-upload="false"
		:disabled="loading"
		@upload="onUpload"
	>
		<el-button type="success" :icon="Upload" :loading="loading">导入</el-button>
	</cl-upload>

	<cl-form ref="Form">
		<template #slot-tips>
			<el-alert type="warning">如遇到问题无法导入菜单，请检查文件并尝试重新导入。</el-alert>
		</template>
	</cl-form>
</template>

<script lang="ts" setup>
import { Upload } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useCool } from "/@/cool";
import { useCrud, useForm } from "@cool-vue/crud";
import { orderBy } from "lodash-es";
import { ref } from "vue";

const { service } = useCool();
const Form = useForm();
const Crud = useCrud();

const loading = ref(false);

function onUpload(_: any, file: File) {
	// 加载状态
	loading.value = true;

	const reader = new FileReader();

	// 加载完成
	reader.onload = (e: ProgressEvent<FileReader>) => {
		loading.value = false;

		try {
			// 解析数据
			const data = JSON.parse(e.target?.result as string);

			// 打开表单
			Form.value?.open({
				title: "菜单导入",
				height: "400px",
				width: "600px",
				props: {
					labelWidth: "0px"
				},
				op: {
					saveButtonText: "添加"
				},
				items: [
					{
						component: {
							name: "slot-tips"
						}
					},
					{
						component: {
							name: "el-tree",
							props: {
								data: orderBy(data, "orderNum", "asc"),
								nodeKey: "name",
								props: {
									label: "name",
									children: "childMenus"
								},
								renderContent(_: any, { data }: any) {
									return data.name;
								}
							},
							style: {
								padding: "5px",
								borderRadius: "var(--el-border-radius-base)",
								border: "1px solid var(--el-border-color)"
							}
						}
					}
				],
				on: {
					submit(_, { close, done }) {
						service.base.sys.menu
							.import({
								menus: data
							})
							.then(() => {
								ElMessage.success("导入成功");
								Crud.value?.refresh();
								close();
							})
							.catch((err) => {
								ElMessage.error(err.message);
								done();
							});
					}
				}
			});
		} catch (error) {
			ElMessage.error(`${file.name}文件格式错误：${error}`);
		}
	};

	// 读取文件
	reader.readAsText(file);
}
</script>
