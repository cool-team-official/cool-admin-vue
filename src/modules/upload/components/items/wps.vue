<template>
	<cl-dialog v-model="visible" width="80%" height="70vh" @closed="onClosed">
		<div class="wps-viewer"></div>
	</cl-dialog>
</template>

<script lang="ts" setup>
/**
 * wps预览组件
 * @param {string} officeType Writer | Spreadsheet | Presentation | Pdf
 * @param {string} fileId 文件 id，用户自定义
 * @param {string} mount 挂载节点
 * @param {string} token 授权
 */

import { ElMessage } from "element-plus";
import WebOfficeSDK, { IAppConfig } from "ts-wps";
import { ref } from "vue";
import { useBase } from "/$/base";
import { useCool } from "/@/cool";

const props = defineProps({
	officeType: {
		type: String,
		default: "Writer"
	},
	fileId: {
		type: String,
		default: ""
	},
	token: String
});

const { service } = useCool();
const { user } = useBase();

// 应用ID
const appId = ref("");

// 是否可见
const visible = ref(false);

// 获取应用ID
async function getAppId() {
	if (!appId.value) {
		await service.space.info.getConfig().then((res) => {
			appId.value = res.appId;
		});
	}
}

let wps: any = null;

/**
 * 打开wps预览
 * @param data WebOfficeSDK.IAppConfig
 */
async function open(data: IAppConfig) {
	visible.value = true;

	await getAppId();

	if (!appId.value) {
		return ElMessage.error("请先配置WPS的应用ID");
	}

	wps = WebOfficeSDK.init({
		officeType: WebOfficeSDK.OfficeType[data.officeType || props.officeType],
		appId: appId.value,
		fileId: data.fileId || props.fileId,
		mount: document.querySelector(".wps-viewer") as HTMLElement,
		fileToken: {
			token: user.token,
			timeout: 10 * 60 * 1000
		}
	});

	wps.ready();
}

function onClosed() {
	wps.destroy();
}

defineExpose({
	open
});
</script>

<style lang="scss">
.wps-viewer {
	height: 100%;

	iframe {
		height: calc(100% - 5px) !important;
		width: 100% !important;
	}
}
</style>
