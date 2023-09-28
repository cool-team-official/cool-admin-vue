<template>
	<cl-dialog v-model="visible" width="80%" @closed="onClosed">
		<div class="file-wps"></div>
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
		officeType: WebOfficeSDK.OfficeType[data.officeType],
		appId: appId.value,
		fileId: data.fileId,
		mount: document.querySelector(".file-wps") as HTMLElement,
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
.file-wps {
	height: 70vh;

	iframe {
		height: calc(100% - 5px) !important;
		width: 100% !important;
	}
}
</style>
