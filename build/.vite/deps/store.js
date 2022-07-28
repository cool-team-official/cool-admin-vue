import {
  __commonJS
} from "./chunk-QOVRSCHT.js";

// node_modules/store/src/util.js
var require_util = __commonJS({
  "node_modules/store/src/util.js"(exports2, module2) {
    var assign = make_assign();
    var create = make_create();
    var trim = make_trim();
    var Global = typeof window !== "undefined" ? window : global;
    module2.exports = {
      assign,
      create,
      trim,
      bind,
      slice,
      each,
      map,
      pluck,
      isList,
      isFunction,
      isObject,
      Global
    };
    function make_assign() {
      if (Object.assign) {
        return Object.assign;
      } else {
        return function shimAssign(obj, props1, props2, etc) {
          for (var i = 1; i < arguments.length; i++) {
            each(Object(arguments[i]), function(val, key) {
              obj[key] = val;
            });
          }
          return obj;
        };
      }
    }
    function make_create() {
      if (Object.create) {
        return function create2(obj, assignProps1, assignProps2, etc) {
          var assignArgsList = slice(arguments, 1);
          return assign.apply(this, [Object.create(obj)].concat(assignArgsList));
        };
      } else {
        let F2 = function() {
        };
        var F = F2;
        return function create2(obj, assignProps1, assignProps2, etc) {
          var assignArgsList = slice(arguments, 1);
          F2.prototype = obj;
          return assign.apply(this, [new F2()].concat(assignArgsList));
        };
      }
    }
    function make_trim() {
      if (String.prototype.trim) {
        return function trim2(str2) {
          return String.prototype.trim.call(str2);
        };
      } else {
        return function trim2(str2) {
          return str2.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
        };
      }
    }
    function bind(obj, fn) {
      return function() {
        return fn.apply(obj, Array.prototype.slice.call(arguments, 0));
      };
    }
    function slice(arr, index) {
      return Array.prototype.slice.call(arr, index || 0);
    }
    function each(obj, fn) {
      pluck(obj, function(val, key) {
        fn(val, key);
        return false;
      });
    }
    function map(obj, fn) {
      var res = isList(obj) ? [] : {};
      pluck(obj, function(v, k) {
        res[k] = fn(v, k);
        return false;
      });
      return res;
    }
    function pluck(obj, fn) {
      if (isList(obj)) {
        for (var i = 0; i < obj.length; i++) {
          if (fn(obj[i], i)) {
            return obj[i];
          }
        }
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (fn(obj[key], key)) {
              return obj[key];
            }
          }
        }
      }
    }
    function isList(val) {
      return val != null && typeof val != "function" && typeof val.length == "number";
    }
    function isFunction(val) {
      return val && {}.toString.call(val) === "[object Function]";
    }
    function isObject(val) {
      return val && {}.toString.call(val) === "[object Object]";
    }
  }
});

// node_modules/store/src/store-engine.js
var require_store_engine = __commonJS({
  "node_modules/store/src/store-engine.js"(exports2, module2) {
    var util = require_util();
    var slice = util.slice;
    var pluck = util.pluck;
    var each = util.each;
    var bind = util.bind;
    var create = util.create;
    var isList = util.isList;
    var isFunction = util.isFunction;
    var isObject = util.isObject;
    module2.exports = {
      createStore
    };
    var storeAPI = {
      version: "2.0.12",
      enabled: false,
      get: function(key, optionalDefaultValue) {
        var data = this.storage.read(this._namespacePrefix + key);
        return this._deserialize(data, optionalDefaultValue);
      },
      set: function(key, value) {
        if (value === void 0) {
          return this.remove(key);
        }
        this.storage.write(this._namespacePrefix + key, this._serialize(value));
        return value;
      },
      remove: function(key) {
        this.storage.remove(this._namespacePrefix + key);
      },
      each: function(callback) {
        var self = this;
        this.storage.each(function(val, namespacedKey) {
          callback.call(self, self._deserialize(val), (namespacedKey || "").replace(self._namespaceRegexp, ""));
        });
      },
      clearAll: function() {
        this.storage.clearAll();
      },
      hasNamespace: function(namespace) {
        return this._namespacePrefix == "__storejs_" + namespace + "_";
      },
      createStore: function() {
        return createStore.apply(this, arguments);
      },
      addPlugin: function(plugin) {
        this._addPlugin(plugin);
      },
      namespace: function(namespace) {
        return createStore(this.storage, this.plugins, namespace);
      }
    };
    function _warn() {
      var _console = typeof console == "undefined" ? null : console;
      if (!_console) {
        return;
      }
      var fn = _console.warn ? _console.warn : _console.log;
      fn.apply(_console, arguments);
    }
    function createStore(storages, plugins, namespace) {
      if (!namespace) {
        namespace = "";
      }
      if (storages && !isList(storages)) {
        storages = [storages];
      }
      if (plugins && !isList(plugins)) {
        plugins = [plugins];
      }
      var namespacePrefix = namespace ? "__storejs_" + namespace + "_" : "";
      var namespaceRegexp = namespace ? new RegExp("^" + namespacePrefix) : null;
      var legalNamespaces = /^[a-zA-Z0-9_\-]*$/;
      if (!legalNamespaces.test(namespace)) {
        throw new Error("store.js namespaces can only have alphanumerics + underscores and dashes");
      }
      var _privateStoreProps = {
        _namespacePrefix: namespacePrefix,
        _namespaceRegexp: namespaceRegexp,
        _testStorage: function(storage) {
          try {
            var testStr = "__storejs__test__";
            storage.write(testStr, testStr);
            var ok = storage.read(testStr) === testStr;
            storage.remove(testStr);
            return ok;
          } catch (e) {
            return false;
          }
        },
        _assignPluginFnProp: function(pluginFnProp, propName) {
          var oldFn = this[propName];
          this[propName] = function pluginFn() {
            var args = slice(arguments, 0);
            var self = this;
            function super_fn() {
              if (!oldFn) {
                return;
              }
              each(arguments, function(arg, i) {
                args[i] = arg;
              });
              return oldFn.apply(self, args);
            }
            var newFnArgs = [super_fn].concat(args);
            return pluginFnProp.apply(self, newFnArgs);
          };
        },
        _serialize: function(obj) {
          return JSON.stringify(obj);
        },
        _deserialize: function(strVal, defaultVal) {
          if (!strVal) {
            return defaultVal;
          }
          var val = "";
          try {
            val = JSON.parse(strVal);
          } catch (e) {
            val = strVal;
          }
          return val !== void 0 ? val : defaultVal;
        },
        _addStorage: function(storage) {
          if (this.enabled) {
            return;
          }
          if (this._testStorage(storage)) {
            this.storage = storage;
            this.enabled = true;
          }
        },
        _addPlugin: function(plugin) {
          var self = this;
          if (isList(plugin)) {
            each(plugin, function(plugin2) {
              self._addPlugin(plugin2);
            });
            return;
          }
          var seenPlugin = pluck(this.plugins, function(seenPlugin2) {
            return plugin === seenPlugin2;
          });
          if (seenPlugin) {
            return;
          }
          this.plugins.push(plugin);
          if (!isFunction(plugin)) {
            throw new Error("Plugins must be function values that return objects");
          }
          var pluginProperties = plugin.call(this);
          if (!isObject(pluginProperties)) {
            throw new Error("Plugins must return an object of function properties");
          }
          each(pluginProperties, function(pluginFnProp, propName) {
            if (!isFunction(pluginFnProp)) {
              throw new Error("Bad plugin property: " + propName + " from plugin " + plugin.name + ". Plugins should only return functions.");
            }
            self._assignPluginFnProp(pluginFnProp, propName);
          });
        },
        addStorage: function(storage) {
          _warn("store.addStorage(storage) is deprecated. Use createStore([storages])");
          this._addStorage(storage);
        }
      };
      var store = create(_privateStoreProps, storeAPI, {
        plugins: []
      });
      store.raw = {};
      each(store, function(prop, propName) {
        if (isFunction(prop)) {
          store.raw[propName] = bind(store, prop);
        }
      });
      each(storages, function(storage) {
        store._addStorage(storage);
      });
      each(plugins, function(plugin) {
        store._addPlugin(plugin);
      });
      return store;
    }
  }
});

// node_modules/store/storages/localStorage.js
var require_localStorage = __commonJS({
  "node_modules/store/storages/localStorage.js"(exports2, module2) {
    var util = require_util();
    var Global = util.Global;
    module2.exports = {
      name: "localStorage",
      read,
      write,
      each,
      remove,
      clearAll
    };
    function localStorage() {
      return Global.localStorage;
    }
    function read(key) {
      return localStorage().getItem(key);
    }
    function write(key, data) {
      return localStorage().setItem(key, data);
    }
    function each(fn) {
      for (var i = localStorage().length - 1; i >= 0; i--) {
        var key = localStorage().key(i);
        fn(read(key), key);
      }
    }
    function remove(key) {
      return localStorage().removeItem(key);
    }
    function clearAll() {
      return localStorage().clear();
    }
  }
});

// node_modules/store/storages/oldFF-globalStorage.js
var require_oldFF_globalStorage = __commonJS({
  "node_modules/store/storages/oldFF-globalStorage.js"(exports2, module2) {
    var util = require_util();
    var Global = util.Global;
    module2.exports = {
      name: "oldFF-globalStorage",
      read,
      write,
      each,
      remove,
      clearAll
    };
    var globalStorage = Global.globalStorage;
    function read(key) {
      return globalStorage[key];
    }
    function write(key, data) {
      globalStorage[key] = data;
    }
    function each(fn) {
      for (var i = globalStorage.length - 1; i >= 0; i--) {
        var key = globalStorage.key(i);
        fn(globalStorage[key], key);
      }
    }
    function remove(key) {
      return globalStorage.removeItem(key);
    }
    function clearAll() {
      each(function(key, _) {
        delete globalStorage[key];
      });
    }
  }
});

// node_modules/store/storages/oldIE-userDataStorage.js
var require_oldIE_userDataStorage = __commonJS({
  "node_modules/store/storages/oldIE-userDataStorage.js"(exports2, module2) {
    var util = require_util();
    var Global = util.Global;
    module2.exports = {
      name: "oldIE-userDataStorage",
      write,
      read,
      each,
      remove,
      clearAll
    };
    var storageName = "storejs";
    var doc = Global.document;
    var _withStorageEl = _makeIEStorageElFunction();
    var disable = (Global.navigator ? Global.navigator.userAgent : "").match(/ (MSIE 8|MSIE 9|MSIE 10)\./);
    function write(unfixedKey, data) {
      if (disable) {
        return;
      }
      var fixedKey = fixKey(unfixedKey);
      _withStorageEl(function(storageEl) {
        storageEl.setAttribute(fixedKey, data);
        storageEl.save(storageName);
      });
    }
    function read(unfixedKey) {
      if (disable) {
        return;
      }
      var fixedKey = fixKey(unfixedKey);
      var res = null;
      _withStorageEl(function(storageEl) {
        res = storageEl.getAttribute(fixedKey);
      });
      return res;
    }
    function each(callback) {
      _withStorageEl(function(storageEl) {
        var attributes = storageEl.XMLDocument.documentElement.attributes;
        for (var i = attributes.length - 1; i >= 0; i--) {
          var attr = attributes[i];
          callback(storageEl.getAttribute(attr.name), attr.name);
        }
      });
    }
    function remove(unfixedKey) {
      var fixedKey = fixKey(unfixedKey);
      _withStorageEl(function(storageEl) {
        storageEl.removeAttribute(fixedKey);
        storageEl.save(storageName);
      });
    }
    function clearAll() {
      _withStorageEl(function(storageEl) {
        var attributes = storageEl.XMLDocument.documentElement.attributes;
        storageEl.load(storageName);
        for (var i = attributes.length - 1; i >= 0; i--) {
          storageEl.removeAttribute(attributes[i].name);
        }
        storageEl.save(storageName);
      });
    }
    var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
    function fixKey(key) {
      return key.replace(/^\d/, "___$&").replace(forbiddenCharsRegex, "___");
    }
    function _makeIEStorageElFunction() {
      if (!doc || !doc.documentElement || !doc.documentElement.addBehavior) {
        return null;
      }
      var scriptTag = "script", storageOwner, storageContainer, storageEl;
      try {
        storageContainer = new ActiveXObject("htmlfile");
        storageContainer.open();
        storageContainer.write("<" + scriptTag + ">document.w=window</" + scriptTag + '><iframe src="/favicon.ico"></iframe>');
        storageContainer.close();
        storageOwner = storageContainer.w.frames[0].document;
        storageEl = storageOwner.createElement("div");
      } catch (e) {
        storageEl = doc.createElement("div");
        storageOwner = doc.body;
      }
      return function(storeFunction) {
        var args = [].slice.call(arguments, 0);
        args.unshift(storageEl);
        storageOwner.appendChild(storageEl);
        storageEl.addBehavior("#default#userData");
        storageEl.load(storageName);
        storeFunction.apply(this, args);
        storageOwner.removeChild(storageEl);
        return;
      };
    }
  }
});

// node_modules/store/storages/cookieStorage.js
var require_cookieStorage = __commonJS({
  "node_modules/store/storages/cookieStorage.js"(exports2, module2) {
    var util = require_util();
    var Global = util.Global;
    var trim = util.trim;
    module2.exports = {
      name: "cookieStorage",
      read,
      write,
      each,
      remove,
      clearAll
    };
    var doc = Global.document;
    function read(key) {
      if (!key || !_has(key)) {
        return null;
      }
      var regexpStr = "(?:^|.*;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*";
      return unescape(doc.cookie.replace(new RegExp(regexpStr), "$1"));
    }
    function each(callback) {
      var cookies = doc.cookie.split(/; ?/g);
      for (var i = cookies.length - 1; i >= 0; i--) {
        if (!trim(cookies[i])) {
          continue;
        }
        var kvp = cookies[i].split("=");
        var key = unescape(kvp[0]);
        var val = unescape(kvp[1]);
        callback(val, key);
      }
    }
    function write(key, data) {
      if (!key) {
        return;
      }
      doc.cookie = escape(key) + "=" + escape(data) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
    }
    function remove(key) {
      if (!key || !_has(key)) {
        return;
      }
      doc.cookie = escape(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
    function clearAll() {
      each(function(_, key) {
        remove(key);
      });
    }
    function _has(key) {
      return new RegExp("(?:^|;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(doc.cookie);
    }
  }
});

// node_modules/store/storages/sessionStorage.js
var require_sessionStorage = __commonJS({
  "node_modules/store/storages/sessionStorage.js"(exports2, module2) {
    var util = require_util();
    var Global = util.Global;
    module2.exports = {
      name: "sessionStorage",
      read,
      write,
      each,
      remove,
      clearAll
    };
    function sessionStorage() {
      return Global.sessionStorage;
    }
    function read(key) {
      return sessionStorage().getItem(key);
    }
    function write(key, data) {
      return sessionStorage().setItem(key, data);
    }
    function each(fn) {
      for (var i = sessionStorage().length - 1; i >= 0; i--) {
        var key = sessionStorage().key(i);
        fn(read(key), key);
      }
    }
    function remove(key) {
      return sessionStorage().removeItem(key);
    }
    function clearAll() {
      return sessionStorage().clear();
    }
  }
});

// node_modules/store/storages/memoryStorage.js
var require_memoryStorage = __commonJS({
  "node_modules/store/storages/memoryStorage.js"(exports2, module2) {
    module2.exports = {
      name: "memoryStorage",
      read,
      write,
      each,
      remove,
      clearAll
    };
    var memoryStorage = {};
    function read(key) {
      return memoryStorage[key];
    }
    function write(key, data) {
      memoryStorage[key] = data;
    }
    function each(callback) {
      for (var key in memoryStorage) {
        if (memoryStorage.hasOwnProperty(key)) {
          callback(memoryStorage[key], key);
        }
      }
    }
    function remove(key) {
      delete memoryStorage[key];
    }
    function clearAll(key) {
      memoryStorage = {};
    }
  }
});

// node_modules/store/storages/all.js
var require_all = __commonJS({
  "node_modules/store/storages/all.js"(exports2, module2) {
    module2.exports = [
      require_localStorage(),
      require_oldFF_globalStorage(),
      require_oldIE_userDataStorage(),
      require_cookieStorage(),
      require_sessionStorage(),
      require_memoryStorage()
    ];
  }
});

// node_modules/store/plugins/lib/json2.js
var require_json2 = __commonJS({
  "node_modules/store/plugins/lib/json2.js"(exports, module) {
    if (typeof JSON !== "object") {
      JSON = {};
    }
    (function() {
      "use strict";
      var rx_one = /^[\],:{}\s]*$/;
      var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
      var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
      var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
      var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
      var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
      function f(n) {
        return n < 10 ? "0" + n : n;
      }
      function this_value() {
        return this.valueOf();
      }
      if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function() {
          return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
        };
        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
      }
      var gap;
      var indent;
      var meta;
      var rep;
      function quote(string) {
        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string) ? '"' + string.replace(rx_escapable, function(a) {
          var c = meta[a];
          return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
      }
      function str(key, holder) {
        var i;
        var k;
        var v;
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
          value = value.toJSON(key);
        }
        if (typeof rep === "function") {
          value = rep.call(holder, key, value);
        }
        switch (typeof value) {
          case "string":
            return quote(value);
          case "number":
            return isFinite(value) ? String(value) : "null";
          case "boolean":
          case "null":
            return String(value);
          case "object":
            if (!value) {
              return "null";
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
              length = value.length;
              for (i = 0; i < length; i += 1) {
                partial[i] = str(i, value) || "null";
              }
              v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
              gap = mind;
              return v;
            }
            if (rep && typeof rep === "object") {
              length = rep.length;
              for (i = 0; i < length; i += 1) {
                if (typeof rep[i] === "string") {
                  k = rep[i];
                  v = str(k, value);
                  if (v) {
                    partial.push(quote(k) + (gap ? ": " : ":") + v);
                  }
                }
              }
            } else {
              for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                  v = str(k, value);
                  if (v) {
                    partial.push(quote(k) + (gap ? ": " : ":") + v);
                  }
                }
              }
            }
            v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
      }
      if (typeof JSON.stringify !== "function") {
        meta = {
          "\b": "\\b",
          "	": "\\t",
          "\n": "\\n",
          "\f": "\\f",
          "\r": "\\r",
          '"': '\\"',
          "\\": "\\\\"
        };
        JSON.stringify = function(value, replacer, space) {
          var i;
          gap = "";
          indent = "";
          if (typeof space === "number") {
            for (i = 0; i < space; i += 1) {
              indent += " ";
            }
          } else if (typeof space === "string") {
            indent = space;
          }
          rep = replacer;
          if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
            throw new Error("JSON.stringify");
          }
          return str("", { "": value });
        };
      }
      if (typeof JSON.parse !== "function") {
        JSON.parse = function(text, reviver) {
          var j;
          function walk(holder, key) {
            var k;
            var v;
            var value = holder[key];
            if (value && typeof value === "object") {
              for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                  v = walk(value, k);
                  if (v !== void 0) {
                    value[k] = v;
                  } else {
                    delete value[k];
                  }
                }
              }
            }
            return reviver.call(holder, key, value);
          }
          text = String(text);
          rx_dangerous.lastIndex = 0;
          if (rx_dangerous.test(text)) {
            text = text.replace(rx_dangerous, function(a) {
              return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            });
          }
          if (rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) {
            j = eval("(" + text + ")");
            return typeof reviver === "function" ? walk({ "": j }, "") : j;
          }
          throw new SyntaxError("JSON.parse");
        };
      }
    })();
  }
});

// node_modules/store/plugins/json2.js
var require_json22 = __commonJS({
  "node_modules/store/plugins/json2.js"(exports2, module2) {
    module2.exports = json2Plugin;
    function json2Plugin() {
      require_json2();
      return {};
    }
  }
});

// node_modules/store/dist/store.legacy.js
var require_store_legacy = __commonJS({
  "node_modules/store/dist/store.legacy.js"(exports2, module2) {
    var engine = require_store_engine();
    var storages = require_all();
    var plugins = [require_json22()];
    module2.exports = engine.createStore(storages, plugins);
  }
});

// dep:store
var store_default = require_store_legacy();
export {
  store_default as default
};
//# sourceMappingURL=store.js.map
