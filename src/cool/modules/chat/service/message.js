import { BaseService, Service, Permission } from "cl-admin";

@Service("app/im/message")
class ImMessage extends BaseService {
	@Permission("read")
	read(data) {
		return this.request({
			url: "/read",
			method: "POST",
			data
		});
	}
}

export default ImMessage;
