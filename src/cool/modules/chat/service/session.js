import { BaseService, Service, Permission } from "cl-admin";

@Service("app/im/session")
class ImSession extends BaseService {
	@Permission("unreadCount")
	unreadCount() {
		return this.request({
			url: "/unreadCount"
		});
	}
}

export default ImSession;
