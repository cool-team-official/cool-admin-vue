import components from "./components";
import directives from "./directives";
import pages from "./pages";
import service from "./service";
import store from "./store";
import views from "./views";

export default {
	install() {
		return {
			components,
			directives,
			pages,
			service,
			store,
			views
		};
	}
};
