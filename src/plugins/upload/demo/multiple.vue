<template>
	<cl-upload v-model="value" text="选择图片" multiple />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const value = ref([]);
</script>
