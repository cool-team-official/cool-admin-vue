<template>
	<error-page :code="403" desc="您无权访问此页面" />
</template>

<script lang="ts">
import ErrorPage from "./components/error-page.vue";

export default {
	cool: {
		route: {
			path: "/403"
		}
	},

	components: {
		ErrorPage
	}
};
</script>
