<template>
	<error-page :code="404" desc="找不到您要查找的页面" />
</template>

<script lang="ts">
import ErrorPage from "./components/error-page.vue";

export default {
	cool: {
		route: {
			path: "/404"
		}
	},

	components: {
		ErrorPage
	}
};
</script>
