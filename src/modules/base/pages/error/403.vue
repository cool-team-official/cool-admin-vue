<template>
	<error-page :code="403" desc="您无权访问此页面" />
</template>

<script lang="ts" name="403" setup>
import ErrorPage from "./components/error-page.vue";
</script>
