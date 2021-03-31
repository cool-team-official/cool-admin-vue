<template>
	<error-page :code="502" desc="马上回来" />
</template>

<script>
import ErrorPage from "./components/error-page.vue";

export default {
	components: {
		ErrorPage
	}
};
</script>
