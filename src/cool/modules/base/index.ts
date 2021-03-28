import components from "./components";
import pages from "./pages";
import views from "./views";
import store from "./store";
import service from "./service";
import directives, { checkPerm } from "./directives";
import { iconList } from "./common";
import "./static/css/index.scss";

export { iconList, checkPerm };
export default { components, pages, views, store, service, directives };
