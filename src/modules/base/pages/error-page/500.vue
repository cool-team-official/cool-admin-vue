<template>
	<error-page :code="500" desc="糟糕，出了点问题" />
</template>

<script lang="ts">
import ErrorPage from "./components/error-page.vue";

export default {
	cool: {
		route: {
			path: "/500"
		}
	},

	components: {
		ErrorPage
	}
};
</script>
