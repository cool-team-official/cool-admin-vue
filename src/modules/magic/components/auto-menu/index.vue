<template>
	<quick v-if="isDev" />
	<el-button :icon="MagicStick" @click="toCode">Ai 极速编码</el-button>
</template>

<script lang="ts" name="auto-menu" setup>
import { useCool, isDev } from "/@/cool";
import Quick from "./quick.vue";
import { MagicStick } from "@element-plus/icons-vue";

const { router } = useCool();

function toCode() {
	router.push("/magic/ai-code");
}
</script>
