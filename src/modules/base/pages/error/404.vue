<template>
	<error-page :code="404" desc="找不到您要查找的页面" />
</template>

<script lang="ts" name="404" setup>
import ErrorPage from "./components/error-page.vue";
</script>
