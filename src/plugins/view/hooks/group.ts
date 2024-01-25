import { provide, ref } from "vue";
import { useParent } from "/@/cool";
import type { ClViewGroup } from "../types";

export function useViewGroup(options?: DeepPartial<ClViewGroup.Options>) {
	const ViewGroup = ref<ClViewGroup.Ref>();
	useParent("cl-view-group", ViewGroup);

	if (options) {
		provide("useViewGroup__options", options);
	}

	return { ViewGroup };
}
