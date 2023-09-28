import { ModuleConfig } from "/@/cool";
import { useDict } from "./index";

export default (): ModuleConfig => {
	return {
		onLoad({ hasToken }) {
			const { dict } = useDict();
			hasToken(() => {
				dict.refresh();
			});
		}
	};
};
