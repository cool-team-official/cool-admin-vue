import {
  init,
  throttle
} from "./chunk-IGQFC2UN.js";
import {
  Vue2
} from "./chunk-4LPSWQX5.js";
import "./chunk-WA3WP44A.js";
import {
  computed2 as computed,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  shallowRef,
  toRefs,
  unref,
  watch,
  watchEffect
} from "./chunk-S3Q6TDYU.js";
import "./chunk-QOVRSCHT.js";

// node_modules/resize-detector/esm/index.js
var raf = null;
function requestAnimationFrame(callback) {
  if (!raf) {
    raf = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback2) {
      return setTimeout(callback2, 16);
    }).bind(window);
  }
  return raf(callback);
}
var caf = null;
function cancelAnimationFrame(id) {
  if (!caf) {
    caf = (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function(id2) {
      clearTimeout(id2);
    }).bind(window);
  }
  caf(id);
}
function createStyles(styleText) {
  var style2 = document.createElement("style");
  if (style2.styleSheet) {
    style2.styleSheet.cssText = styleText;
  } else {
    style2.appendChild(document.createTextNode(styleText));
  }
  (document.querySelector("head") || document.body).appendChild(style2);
  return style2;
}
function createElement(tagName, props) {
  if (props === void 0)
    props = {};
  var elem = document.createElement(tagName);
  Object.keys(props).forEach(function(key) {
    elem[key] = props[key];
  });
  return elem;
}
function getComputedStyle(elem, prop, pseudo) {
  var computedStyle = window.getComputedStyle(elem, pseudo || null) || {
    display: "none"
  };
  return computedStyle[prop];
}
function getRenderInfo(elem) {
  if (!document.documentElement.contains(elem)) {
    return {
      detached: true,
      rendered: false
    };
  }
  var current = elem;
  while (current !== document) {
    if (getComputedStyle(current, "display") === "none") {
      return {
        detached: false,
        rendered: false
      };
    }
    current = current.parentNode;
  }
  return {
    detached: false,
    rendered: true
  };
}
var css_248z = '.resize-triggers{visibility:hidden;opacity:0;pointer-events:none}.resize-contract-trigger,.resize-contract-trigger:before,.resize-expand-trigger,.resize-triggers{content:"";position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden}.resize-contract-trigger,.resize-expand-trigger{background:#eee;overflow:auto}.resize-contract-trigger:before{width:200%;height:200%}';
var total = 0;
var style = null;
function addListener(elem, callback) {
  if (!elem.__resize_mutation_handler__) {
    elem.__resize_mutation_handler__ = handleMutation.bind(elem);
  }
  var listeners = elem.__resize_listeners__;
  if (!listeners) {
    elem.__resize_listeners__ = [];
    if (window.ResizeObserver) {
      var offsetWidth = elem.offsetWidth;
      var offsetHeight = elem.offsetHeight;
      var ro = new ResizeObserver(function() {
        if (!elem.__resize_observer_triggered__) {
          elem.__resize_observer_triggered__ = true;
          if (elem.offsetWidth === offsetWidth && elem.offsetHeight === offsetHeight) {
            return;
          }
        }
        runCallbacks(elem);
      });
      var ref = getRenderInfo(elem);
      var detached = ref.detached;
      var rendered = ref.rendered;
      elem.__resize_observer_triggered__ = detached === false && rendered === false;
      elem.__resize_observer__ = ro;
      ro.observe(elem);
    } else if (elem.attachEvent && elem.addEventListener) {
      elem.__resize_legacy_resize_handler__ = function handleLegacyResize() {
        runCallbacks(elem);
      };
      elem.attachEvent("onresize", elem.__resize_legacy_resize_handler__);
      document.addEventListener("DOMSubtreeModified", elem.__resize_mutation_handler__);
    } else {
      if (!total) {
        style = createStyles(css_248z);
      }
      initTriggers(elem);
      elem.__resize_rendered__ = getRenderInfo(elem).rendered;
      if (window.MutationObserver) {
        var mo = new MutationObserver(elem.__resize_mutation_handler__);
        mo.observe(document, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
        elem.__resize_mutation_observer__ = mo;
      }
    }
  }
  elem.__resize_listeners__.push(callback);
  total++;
}
function removeListener(elem, callback) {
  var listeners = elem.__resize_listeners__;
  if (!listeners) {
    return;
  }
  if (callback) {
    listeners.splice(listeners.indexOf(callback), 1);
  }
  if (!listeners.length || !callback) {
    if (elem.detachEvent && elem.removeEventListener) {
      elem.detachEvent("onresize", elem.__resize_legacy_resize_handler__);
      document.removeEventListener("DOMSubtreeModified", elem.__resize_mutation_handler__);
      return;
    }
    if (elem.__resize_observer__) {
      elem.__resize_observer__.unobserve(elem);
      elem.__resize_observer__.disconnect();
      elem.__resize_observer__ = null;
    } else {
      if (elem.__resize_mutation_observer__) {
        elem.__resize_mutation_observer__.disconnect();
        elem.__resize_mutation_observer__ = null;
      }
      elem.removeEventListener("scroll", handleScroll);
      elem.removeChild(elem.__resize_triggers__.triggers);
      elem.__resize_triggers__ = null;
    }
    elem.__resize_listeners__ = null;
  }
  if (!--total && style) {
    style.parentNode.removeChild(style);
  }
}
function getUpdatedSize(elem) {
  var ref = elem.__resize_last__;
  var width = ref.width;
  var height = ref.height;
  var offsetWidth = elem.offsetWidth;
  var offsetHeight = elem.offsetHeight;
  if (offsetWidth !== width || offsetHeight !== height) {
    return {
      width: offsetWidth,
      height: offsetHeight
    };
  }
  return null;
}
function handleMutation() {
  var ref = getRenderInfo(this);
  var rendered = ref.rendered;
  var detached = ref.detached;
  if (rendered !== this.__resize_rendered__) {
    if (!detached && this.__resize_triggers__) {
      resetTriggers(this);
      this.addEventListener("scroll", handleScroll, true);
    }
    this.__resize_rendered__ = rendered;
    runCallbacks(this);
  }
}
function handleScroll() {
  var this$1 = this;
  resetTriggers(this);
  if (this.__resize_raf__) {
    cancelAnimationFrame(this.__resize_raf__);
  }
  this.__resize_raf__ = requestAnimationFrame(function() {
    var updated = getUpdatedSize(this$1);
    if (updated) {
      this$1.__resize_last__ = updated;
      runCallbacks(this$1);
    }
  });
}
function runCallbacks(elem) {
  if (!elem || !elem.__resize_listeners__) {
    return;
  }
  elem.__resize_listeners__.forEach(function(callback) {
    callback.call(elem, elem);
  });
}
function initTriggers(elem) {
  var position = getComputedStyle(elem, "position");
  if (!position || position === "static") {
    elem.style.position = "relative";
  }
  elem.__resize_old_position__ = position;
  elem.__resize_last__ = {};
  var triggers = createElement("div", {
    className: "resize-triggers"
  });
  var expand = createElement("div", {
    className: "resize-expand-trigger"
  });
  var expandChild = createElement("div");
  var contract = createElement("div", {
    className: "resize-contract-trigger"
  });
  expand.appendChild(expandChild);
  triggers.appendChild(expand);
  triggers.appendChild(contract);
  elem.appendChild(triggers);
  elem.__resize_triggers__ = {
    triggers,
    expand,
    expandChild,
    contract
  };
  resetTriggers(elem);
  elem.addEventListener("scroll", handleScroll, true);
  elem.__resize_last__ = {
    width: elem.offsetWidth,
    height: elem.offsetHeight
  };
}
function resetTriggers(elem) {
  var ref = elem.__resize_triggers__;
  var expand = ref.expand;
  var expandChild = ref.expandChild;
  var contract = ref.contract;
  var csw = contract.scrollWidth;
  var csh = contract.scrollHeight;
  var eow = expand.offsetWidth;
  var eoh = expand.offsetHeight;
  var esw = expand.scrollWidth;
  var esh = expand.scrollHeight;
  contract.scrollLeft = csw;
  contract.scrollTop = csh;
  expandChild.style.width = eow + 1 + "px";
  expandChild.style.height = eoh + 1 + "px";
  expand.scrollLeft = esw;
  expand.scrollTop = esh;
}

// node_modules/vue-echarts/dist/index.esm.min.js
var m = function() {
  return m = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++)
      for (var o in t = arguments[n])
        Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
    return e;
  }, m.apply(this, arguments);
};
var b = ["getWidth", "getHeight", "getDom", "getOption", "resize", "dispatchAction", "convertToPixel", "convertFromPixel", "containPixel", "getDataURL", "getConnectedDataURL", "appendData", "clear", "isDisposed", "dispose"];
function y(e) {
  return t = /* @__PURE__ */ Object.create(null), b.forEach(function(n) {
    t[n] = function(t2) {
      return function() {
        for (var n2 = [], r = 0; r < arguments.length; r++)
          n2[r] = arguments[r];
        if (!e.value)
          throw new Error("ECharts is not initialized yet.");
        return e.value[t2].apply(e.value, n2);
      };
    }(n);
  }), t;
  var t;
}
var x = { autoresize: Boolean };
var j = "ecLoadingOptions";
var _ = { loading: Boolean, loadingOptions: Object };
var E = /^on[^a-z]/;
var A = function(e) {
  return E.test(e);
};
var z = [];
var L = [];
!function(e, t) {
  if (e && "undefined" != typeof document) {
    var n, r = true === t.prepend ? "prepend" : "append", o = true === t.singleTag, i = "string" == typeof t.container ? document.querySelector(t.container) : document.getElementsByTagName("head")[0];
    if (o) {
      var a = z.indexOf(i);
      -1 === a && (a = z.push(i) - 1, L[a] = {}), n = L[a] && L[a][r] ? L[a][r] : L[a][r] = u();
    } else
      n = u();
    65279 === e.charCodeAt(0) && (e = e.substring(1)), n.styleSheet ? n.styleSheet.cssText += e : n.appendChild(document.createTextNode(e));
  }
  function u() {
    var e2 = document.createElement("style");
    if (e2.setAttribute("type", "text/css"), t.attributes)
      for (var n2 = Object.keys(t.attributes), o2 = 0; o2 < n2.length; o2++)
        e2.setAttribute(n2[o2], t.attributes[n2[o2]]);
    var a2 = "prepend" === r ? "afterbegin" : "beforeend";
    return i.insertAdjacentElement(a2, e2), e2;
  }
}("x-vue-echarts{display:block;width:100%;height:100%}", {});
Vue2 && Vue2.config.ignoredElements.push("x-vue-echarts");
var w = "ecTheme";
var T = "ecInitOptions";
var U = "ecUpdateOptions";
var C = defineComponent({ name: "echarts", props: m(m({ option: Object, theme: { type: [Object, String] }, initOptions: Object, updateOptions: Object, group: String, manualUpdate: Boolean }, x), _), inheritAttrs: false, setup: function(i, a) {
  var f = a.attrs, b2 = shallowRef(), x2 = shallowRef(), j2 = shallowRef(), _2 = inject("ecTheme", null), E2 = inject("ecInitOptions", null), z2 = inject("ecUpdateOptions", null), L2 = toRefs(i), w2 = L2.autoresize, T2 = L2.manualUpdate, U2 = L2.loading, C2 = L2.loadingOptions, D = computed(function() {
    return j2.value || i.option || null;
  }), S = computed(function() {
    return i.theme || unref(_2) || {};
  }), k = computed(function() {
    return i.initOptions || unref(E2) || {};
  }), B = computed(function() {
    return i.updateOptions || unref(z2) || {};
  }), P = computed(function() {
    return function(e) {
      var t = {};
      for (var n in e)
        A(n) || (t[n] = e[n]);
      return t;
    }(f);
  }), I = getCurrentInstance().proxy.$listeners;
  function N(e) {
    if (b2.value) {
      var t = x2.value = init(b2.value, S.value, k.value);
      i.group && (t.group = i.group);
      var n = I;
      n || (n = {}, Object.keys(f).filter(function(e2) {
        return 0 === e2.indexOf("on") && e2.length > 2;
      }).forEach(function(e2) {
        var t2 = e2.charAt(2).toLowerCase() + e2.slice(3);
        "Once" === t2.substring(t2.length - 4) && (t2 = "~".concat(t2.substring(0, t2.length - 4))), n[t2] = f[e2];
      })), Object.keys(n).forEach(function(e2) {
        var r2 = n[e2];
        if (r2) {
          var o = e2.toLowerCase();
          "~" === o.charAt(0) && (o = o.substring(1), r2.__once__ = true);
          var i2 = t;
          if (0 === o.indexOf("zr:") && (i2 = t.getZr(), o = o.substring(3)), r2.__once__) {
            delete r2.__once__;
            var a2 = r2;
            r2 = function() {
              for (var e3 = [], t2 = 0; t2 < arguments.length; t2++)
                e3[t2] = arguments[t2];
              a2.apply(void 0, e3), i2.off(o, r2);
            };
          }
          i2.on(o, r2);
        }
      }), w2.value ? nextTick(function() {
        t && !t.isDisposed() && t.resize(), r();
      }) : r();
    }
    function r() {
      var n2 = e || D.value;
      n2 && t.setOption(n2, B.value);
    }
  }
  function R() {
    x2.value && (x2.value.dispose(), x2.value = void 0);
  }
  var q = null;
  watch(T2, function(t) {
    "function" == typeof q && (q(), q = null), t || (q = watch(function() {
      return i.option;
    }, function(e, t2) {
      e && (x2.value ? x2.value.setOption(e, m({ notMerge: e.value !== (null == t2 ? void 0 : t2.value) }, B.value)) : N());
    }, { deep: true }));
  }, { immediate: true }), watch([S, k], function() {
    R(), N();
  }, { deep: true }), watchEffect(function() {
    i.group && x2.value && (x2.value.group = i.group);
  });
  var F = y(x2);
  return function(e, i2, a2) {
    var u = inject("ecLoadingOptions", {}), c = computed(function() {
      return m(m({}, unref(u)), null == a2 ? void 0 : a2.value);
    });
    watchEffect(function() {
      var t = e.value;
      t && (i2.value ? t.showLoading(c.value) : t.hideLoading());
    });
  }(x2, U2, C2), function(t, n, r) {
    var o = null;
    watch([r, t, n], function(e, t2, n2) {
      var r2 = e[0], i2 = e[1], a2 = e[2];
      r2 && i2 && a2 && (o = throttle(function() {
        i2.resize();
      }, 100), addListener(r2, o)), n2(function() {
        o && r2 && removeListener(r2, o);
      });
    });
  }(x2, w2, b2), onMounted(function() {
    N();
  }), onUnmounted(R), m({ chart: x2, root: b2, setOption: function(e, t) {
    i.manualUpdate && (j2.value = e), x2.value ? x2.value.setOption(e, t || {}) : N(e);
  }, nonEventAttrs: P }, F);
}, render: function() {
  var e = m({}, this.nonEventAttrs);
  return e.ref = "root", e.class = e.class ? ["echarts"].concat(e.class) : "echarts", h("x-vue-echarts", e);
} });

// dep:vue-echarts
var vue_echarts_default = C;
export {
  T as INIT_OPTIONS_KEY,
  j as LOADING_OPTIONS_KEY,
  w as THEME_KEY,
  U as UPDATE_OPTIONS_KEY,
  vue_echarts_default as default
};
//# sourceMappingURL=vue-echarts.js.map
