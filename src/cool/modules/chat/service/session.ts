import { BaseService, Service, Permission } from "@/core";

@Service({
	namespace: "im/session",
	mock: true
})
class ImSession extends BaseService {
	@Permission("unreadCount")
	unreadCount() {
		return this.request({
			url: "/unreadCount"
		});
	}
}

export default ImSession;
