<template>
	<quick v-if="isDev" />
</template>

<script lang="ts" name="auto-menu" setup>
import Quick from "./quick.vue";
import { isDev } from "/@/config";
</script>
