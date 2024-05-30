import { App } from "vue";
import Crud from "./crud";
import AddBtn from "./add-btn";
import AdvBtn from "./adv/btn";
import AdvSearch from "./adv/search";
import Flex from "./flex1";
import Form from "./form";
import FormTabs from "./form-tabs";
import FormCard from "./form-card";
import MultiDeleteBtn from "./multi-delete-btn";
import Pagination from "./pagination";
import RefreshBtn from "./refresh-btn";
import SearchKey from "./search-key";
import Table from "./table";
import Upsert from "./upsert";
import Dialog from "./dialog";
import Filter from "./filter";
import Search from "./search";
import ErrorMessage from "./error-message";
import Row from "./row";
import ContextMenu from "./context-menu";

export const components: { [key: string]: any } = {
	Crud,
	AddBtn,
	AdvBtn,
	AdvSearch,
	Flex,
	Form,
	FormTabs,
	FormCard,
	MultiDeleteBtn,
	Pagination,
	RefreshBtn,
	SearchKey,
	Table,
	Upsert,
	Dialog,
	Filter,
	Search,
	ErrorMessage,
	Row,
	ContextMenu
};

export function useComponent(app: App) {
	for (const i in components) {
		app.component(components[i].name, components[i]);
	}
}
