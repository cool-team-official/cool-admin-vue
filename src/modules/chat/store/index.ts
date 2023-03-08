import { useMessageStore } from "./message";
import { useSessionStore } from "./session";

export function useStore() {
	const session = useSessionStore();
	const message = useMessageStore();

	return {
		session,
		message
	};
}
