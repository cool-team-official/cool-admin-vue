<template>
	<error-page :code="401" desc="认证失败，请重新登录！" />
</template>

<script lang="ts" name="401" setup>
import ErrorPage from "./components/error-page.vue";
</script>
