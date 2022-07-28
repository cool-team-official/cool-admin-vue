import { ModuleConfig } from "/@/cool";
import { useDict } from "./index";

export default (): ModuleConfig => {
	return {
		async onLoad({ hasToken }) {
			const { dict } = useDict();

			await hasToken(async () => {
				await dict.refresh();
			});
		}
	};
};
