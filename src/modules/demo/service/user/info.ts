import axios from "axios";
import { BaseService, Service } from "/@/cool";
import dayjs from "dayjs";

@Service("demo/user/info")
class DemoUserInfo extends BaseService {
	// 测试方法，使用 request 请求数据
	t1() {
		return this.request({
			url: "/t1" // 测试地址，实际项目中请更换为真实接口地址
		});
	}

	// 自定义请求，通过 axios 返回数据
	t2() {
		return axios({
			url: "https://"
		});
	}

	// 自定义请求，通过 Promise 返回数据
	t3() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve({
					date: dayjs().format("YYYY-MM-DD HH:mm:ss")
				});
			}, 1500);
		});
	}
}

export default DemoUserInfo;
