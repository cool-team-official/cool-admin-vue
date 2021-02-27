import store from 'store'

export default {
    // 后缀标识
    suffix: "_deadtime",

    /**
     * 获取
     * @param {string} key 关键字
     */
    get(key) {
        return store.get(key)
    },

    /**
     * 获取全部
     */
    info() {
        let d = {}

        store.each(function (value, key) {
            d[key] = value
        })

        return d
    },

    /**
     * 设置
     * @param {string} key 关键字
     * @param {*} value 值
     * @param {number} expires 过期时间
     */
    set(key, value, expires) {
        store.set(key, value);

        if (expires) {
            store.set(`${key}${this.suffix}`, Date.parse(new Date()) + expires * 1000);
        }
    },

    /**
     * 是否过期
     * @param {string} key 关键字
     */
    isExpired(key) {
        return (this.getExpiration(key) || 0) - Date.parse(new Date()) <= 2000;
    },

    /**
     * 获取到期时间
     * @param {string} key 关键字
     */
    getExpiration(key) {
        return this.get(key + this.suffix)
    },

    /**
     * 移除
     * @param {string} key 关键字
     */
    remove(key) {
        store.remove(key)
        this.removeExpiration(key)
    },

    /**
     * 移除到期时间
     * @param {string} key 关键字
     */
    removeExpiration(key) {
        store.remove(key + this.suffix)
    },

    /**
     * 清理
     */
    clearAll() {
        store.clearAll()
    }
};
