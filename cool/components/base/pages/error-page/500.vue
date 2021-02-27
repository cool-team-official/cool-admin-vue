<template>
	<error-page :code="500" desc="糟糕，出了点问题"></error-page>
</template>

<script>
import ErrorPage from "./components/error-page";

export default {
	components: {
		ErrorPage
	}
};
</script>
