<template>
	<error-page :code="404" desc="找不到您要查找的页面"></error-page>
</template>

<script>
import ErrorPage from "./components/error-page";

export default {
	components: {
		ErrorPage
	}
};
</script>
