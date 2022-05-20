<template>
	<error-page :code="502" desc="马上回来" />
</template>

<script lang="ts">
import ErrorPage from "./components/error-page.vue";

export default {
	cool: {
		route: {
			path: "/502"
		}
	},

	components: {
		ErrorPage
	}
};
</script>
