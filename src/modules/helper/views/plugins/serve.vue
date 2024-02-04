<template>
	<div class="plugins" @dragover="onDragover" @drop="onDrop">
		<el-tabs v-model="tab.active" type="card" @tab-change="tab.onChange">
			<el-tab-pane label="已安装插件" name="installed"> </el-tab-pane>
			<el-tab-pane label="插件市场" name="shop"> </el-tab-pane>
		</el-tabs>

		<el-row :gutter="10">
			<el-col v-for="(item, index) in list" :key="index" :xs="24" :sm="12" :md="8" :lg="6">
				<div class="scope">
					<div class="c">
						<el-icon class="set" @click="toSet(item)">
							<setting />
						</el-icon>

						<img class="logo" :src="'data:image/jpg;base64,' + item.logo" />

						<div class="det">
							<div class="tag">
								<el-tag size="small" effect="dark">{{ item.keyName }}</el-tag>
								<el-tag size="small" effect="dark" type="success"
									>v{{ item.version }}</el-tag
								>
							</div>

							<p class="title">
								{{ item.name || "未知" }}
							</p>

							<p class="desc">{{ item.description || "暂无描述" }}</p>

							<div class="author">
								<span>{{ item.author }}：</span>
								<span>{{ item.updateTime }}</span>
							</div>
						</div>
					</div>

					<div class="f">
						<el-button round @click="toDetail(item)">详情</el-button>
						<el-button type="danger" round @click="toDel(item, index)">卸载</el-button>

						<cl-flex1 />

						<cl-switch v-model="item.status" @change="onStatusChange(item)"></cl-switch>
					</div>
				</div>
			</el-col>

			<el-col :xs="24" :sm="12" :md="8" :lg="6">
				<cl-upload :before-upload="onBeforeUpload" accept=".cool">
					<div class="scope is-add">
						<el-icon>
							<plus />
						</el-icon>
					</div>
				</cl-upload>
			</el-col>
		</el-row>

		<!-- 详情预览 -->
		<cl-editor-preview
			:ref="setRefs('editorPreview')"
			name="wang"
			:show-btn="false"
			:title="`${info?.name} v${info?.version} 说明文档`"
		>
			<template #prepend>
				<div class="info-header">
					<span>作者：{{ info?.author }}</span>
					<span>更新时间：{{ info?.updateTime }}</span>
				</div>
			</template>
		</cl-editor-preview>

		<!-- 设置 -->
		<cl-form ref="Form">
			<template #slot-upload>
				<cl-row>
					<cl-upload-space
						:show-list="false"
						:multiple="false"
						text="选择文件"
						@confirm="onFileConfirm"
					/>

					<el-text type="warning" :style="{ marginLeft: '10px' }"
						>选择后会在光标后插入文件链接</el-text
					>
				</cl-row>
			</template>
		</cl-form>
	</div>
</template>

<script lang="ts" setup name="helper-plugins-serve">
import { onActivated, reactive, ref, nextTick } from "vue";
import { useCool } from "/@/cool";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Setting } from "@element-plus/icons-vue";
import { marked } from "marked";
import { useForm } from "@cool-vue/crud";
import { merge, template } from "lodash-es";

const { service, refs, setRefs } = useCool();
const Form = useForm();

// 选项卡
const tab = reactive({
	active: "installed",

	onChange(val: string) {
		if (val == "shop") {
			nextTick(() => {
				tab.active = "installed";
				window.open("https://cool-js.com/");
			});
		}
	}
});

// 插件列表
const list = ref<Eps.PluginInfoEntity[]>([]);

// 插槽详情
const info = ref<Eps.PluginInfoEntity>();

// 刷新
function refresh() {
	service.plugin.info.page().then((res) => {
		list.value = res.list;
	});
}

// 参数设置
function toSet(item: Eps.PluginInfoEntity) {
	Form.value?.open({
		title: "设置",

		form: {
			...item
		},

		items: [
			{
				label: "参数",
				prop: "config",
				value: "{}",
				component: {
					name: "cl-editor",
					props: {
						name: "cl-editor-monaco",
						ref: setRefs("editor")
					}
				}
			},
			{
				label: " ",
				flex: false,
				component: {
					name: "slot-upload"
				}
			},
			{
				label: "状态",
				prop: "status",
				component: {
					name: "cl-switch"
				}
			}
		],

		on: {
			submit(data, { done, close }) {
				service.plugin.info
					.update(data)
					.then(() => {
						ElMessage.success("修改成功");
						merge(item, data);
						close();
					})
					.catch((err) => {
						ElMessage.error(err.message);
						done();
					});
			}
		}
	});
}

// 详情
async function toDetail(item: Eps.PluginInfoEntity) {
	info.value = item;
	refs.editorPreview.open(await marked.parse(item.readme!));
}

// 卸载
function toDel(item: Eps.PluginInfoEntity, index: number) {
	ElMessageBox.confirm(`确定要卸载插件【${item.name}】吗？`, "提示", {
		type: "warning"
	})
		.then(() => {
			service.plugin.info
				.delete({
					ids: [item.id]
				})
				.then(() => {
					list.value.splice(index, 1);
					ElMessage.success("卸载成功");
				})
				.catch((err) => {
					ElMessage.error(err.message);
				});
		})
		.catch(() => null);
}

// 文件选择
function onFileConfirm(arr: any[]) {
	refs.editor.appendContent(arr[0]?.url);
}

// 状态修改
function onStatusChange(item: Eps.PluginInfoEntity) {
	service.plugin.info
		.update({
			id: item.id,
			status: item.status
		})
		.then(() => {
			ElMessage.success(item.status ? "开启成功" : "关闭成功");
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});
}

// 上传
function onBeforeUpload(file: File) {
	function next(force: string) {
		const formData = new FormData();

		formData.append("files", file);
		formData.append("force", force);

		service.plugin.info
			.request({
				url: "/install",
				method: "POST",
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data"
				}
			})
			.then((res) => {
				if (res) {
					ElMessageBox.confirm(res.message, "提示", {
						type: "warning",
						confirmButtonText: "继续"
					})
						.then(() => {
							next("true");
						})
						.catch(() => null);
				} else {
					ElMessage.success("插件安装成功");
					refresh();
				}
			})
			.catch((err) => {
				ElMessage.error(err.message);
			});
	}

	next("false");

	return false;
}

// 拖拽
function onDragover(e: DragEvent) {
	e.preventDefault();
}

// 放下
function onDrop(e: DragEvent) {
	e.preventDefault();

	if (e.dataTransfer) {
		const file = e.dataTransfer.files[0];

		ElMessageBox.confirm("检测到插件，是否安装", "提示", {
			type: "warning",
			confirmButtonText: "安装"
		})
			.then(() => {
				onBeforeUpload(file);
			})
			.catch(() => null);
	}
}

onActivated(() => {
	refresh();
});
</script>

<style lang="scss" scoped>
@import "../../static/index.scss";

.info-header {
	display: flex;
	align-items: center;
	font-size: 13px;
	margin-bottom: 15px;

	span {
		margin-right: 20px;
		line-height: 1;
	}
}
</style>
