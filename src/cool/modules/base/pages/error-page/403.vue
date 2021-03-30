<template>
	<error-page :code="403" desc="您无权访问此页面" />
</template>

<script>
import ErrorPage from "./components/error-page.vue";

export default {
	components: {
		ErrorPage
	}
};
</script>
