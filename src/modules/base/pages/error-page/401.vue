<template>
	<error-page :code="401" desc="认证失败，请重新登录！" />
</template>

<script lang="ts">
import ErrorPage from "./components/error-page.vue";

export default {
	cool: {
		route: {
			path: "/401"
		}
	},

	components: {
		ErrorPage
	}
};
</script>
