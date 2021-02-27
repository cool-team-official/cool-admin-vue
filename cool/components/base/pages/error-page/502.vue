<template>
	<error-page :code="502" desc="马上回来"></error-page>
</template>

<script>
import ErrorPage from "./components/error-page";

export default {
	components: {
		ErrorPage
	}
};
</script>
