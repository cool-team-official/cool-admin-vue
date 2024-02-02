<template>
	<cl-upload v-model="value" multiple text="文件上传" type="file" />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const value = ref([]);
</script>
