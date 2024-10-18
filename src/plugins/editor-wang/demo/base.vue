<template>
	<cl-editor-wang v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref(
	'<p><span style="font-size: 22px;"><em>富文本编</em></span><span style="color: rgb(216, 68, 147); font-size: 22px;"><em>辑器</em></span></p>'
);
</script>
