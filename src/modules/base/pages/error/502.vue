<template>
	<error-page :code="502" desc="马上回来" />
</template>

<script lang="ts" name="502" setup>
import ErrorPage from "./components/error-page.vue";
</script>
