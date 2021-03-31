<template>
	<error-page :code="500" desc="糟糕，出了点问题" />
</template>

<script>
import ErrorPage from "./components/error-page.vue";

export default {
	components: {
		ErrorPage
	}
};
</script>
