<template>
	<error-page :code="500" desc="糟糕，出了点问题" />
</template>

<script lang="ts" name="500" setup>
import ErrorPage from "./components/error-page.vue";
</script>
