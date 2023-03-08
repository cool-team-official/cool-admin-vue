<template>
	<el-config-provider :locale="zhCn">
		<router-view />
	</el-config-provider>
</template>

<script lang="ts" setup>
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
</script>
