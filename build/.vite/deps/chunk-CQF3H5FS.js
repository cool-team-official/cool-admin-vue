import {
  __commonJS,
  __esm,
  __export
} from "./chunk-QOVRSCHT.js";

// node_modules/normalize-wheel-es/dist/index.mjs
var dist_exports = {};
__export(dist_exports, {
  default: () => Y
});
function a() {
  if (!v) {
    v = true;
    var e = navigator.userAgent, n = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(e), i = /(Mac OS X)|(Windows)|(Linux)/.exec(e);
    if (x = /\b(iPhone|iP[ao]d)/.exec(e), E = /\b(iP[ao]d)/.exec(e), w = /Android/i.exec(e), M = /FBAN\/\w+;/i.exec(e), F = /Mobile/i.exec(e), D = !!/Win64/.exec(e), n) {
      o = n[1] ? parseFloat(n[1]) : n[5] ? parseFloat(n[5]) : NaN, o && document && document.documentMode && (o = document.documentMode);
      var r = /(?:Trident\/(\d+.\d+))/.exec(e);
      N = r ? parseFloat(r[1]) + 4 : o, f = n[2] ? parseFloat(n[2]) : NaN, s = n[3] ? parseFloat(n[3]) : NaN, u = n[4] ? parseFloat(n[4]) : NaN, u ? (n = /(?:Chrome\/(\d+\.\d+))/.exec(e), d = n && n[1] ? parseFloat(n[1]) : NaN) : d = NaN;
    } else
      o = f = s = d = u = NaN;
    if (i) {
      if (i[1]) {
        var t = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(e);
        l = t ? parseFloat(t[1].replace("_", ".")) : true;
      } else
        l = false;
      p = !!i[2], m = !!i[3];
    } else
      l = p = m = false;
  }
}
function S(e, n) {
  if (!h.canUseDOM || n && !("addEventListener" in document))
    return false;
  var i = "on" + e, r = i in document;
  if (!r) {
    var t = document.createElement("div");
    t.setAttribute(i, "return;"), r = typeof t[i] == "function";
  }
  return !r && X && e === "wheel" && (r = document.implementation.hasFeature("Events.wheel", "3.0")), r;
}
function T(e) {
  var n = 0, i = 0, r = 0, t = 0;
  return "detail" in e && (i = e.detail), "wheelDelta" in e && (i = -e.wheelDelta / 120), "wheelDeltaY" in e && (i = -e.wheelDeltaY / 120), "wheelDeltaX" in e && (n = -e.wheelDeltaX / 120), "axis" in e && e.axis === e.HORIZONTAL_AXIS && (n = i, i = 0), r = n * O, t = i * O, "deltaY" in e && (t = e.deltaY), "deltaX" in e && (r = e.deltaX), (r || t) && e.deltaMode && (e.deltaMode == 1 ? (r *= I, t *= I) : (r *= P, t *= P)), r && !n && (n = r < 1 ? -1 : 1), t && !i && (i = t < 1 ? -1 : 1), { spinX: n, spinY: i, pixelX: r, pixelY: t };
}
var v, o, f, s, u, d, N, l, p, m, w, D, x, E, M, F, _, A, c, U, h, X, b, O, I, P, Y;
var init_dist = __esm({
  "node_modules/normalize-wheel-es/dist/index.mjs"() {
    v = false;
    _ = { ie: function() {
      return a() || o;
    }, ieCompatibilityMode: function() {
      return a() || N > o;
    }, ie64: function() {
      return _.ie() && D;
    }, firefox: function() {
      return a() || f;
    }, opera: function() {
      return a() || s;
    }, webkit: function() {
      return a() || u;
    }, safari: function() {
      return _.webkit();
    }, chrome: function() {
      return a() || d;
    }, windows: function() {
      return a() || p;
    }, osx: function() {
      return a() || l;
    }, linux: function() {
      return a() || m;
    }, iphone: function() {
      return a() || x;
    }, mobile: function() {
      return a() || x || E || w || F;
    }, nativeApp: function() {
      return a() || M;
    }, android: function() {
      return a() || w;
    }, ipad: function() {
      return a() || E;
    } };
    A = _;
    c = !!(typeof window < "u" && window.document && window.document.createElement);
    U = { canUseDOM: c, canUseWorkers: typeof Worker < "u", canUseEventListeners: c && !!(window.addEventListener || window.attachEvent), canUseViewport: c && !!window.screen, isInWorker: !c };
    h = U;
    h.canUseDOM && (X = document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("", "") !== true);
    b = S;
    O = 10;
    I = 40;
    P = 800;
    T.getEventType = function() {
      return A.firefox() ? "DOMMouseScroll" : b("wheel") ? "wheel" : "mousewheel";
    };
    Y = T;
  }
});

// node_modules/dayjs/plugin/localeData.js
var require_localeData = __commonJS({
  "node_modules/dayjs/plugin/localeData.js"(exports, module) {
    !function(n, e) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (n = "undefined" != typeof globalThis ? globalThis : n || self).dayjs_plugin_localeData = e();
    }(exports, function() {
      "use strict";
      return function(n, e, t) {
        var r = e.prototype, o2 = function(n2) {
          return n2 && (n2.indexOf ? n2 : n2.s);
        }, u2 = function(n2, e2, t2, r2, u3) {
          var i2 = n2.name ? n2 : n2.$locale(), a3 = o2(i2[e2]), s3 = o2(i2[t2]), f2 = a3 || s3.map(function(n3) {
            return n3.slice(0, r2);
          });
          if (!u3)
            return f2;
          var d2 = i2.weekStart;
          return f2.map(function(n3, e3) {
            return f2[(e3 + (d2 || 0)) % 7];
          });
        }, i = function() {
          return t.Ls[t.locale()];
        }, a2 = function(n2, e2) {
          return n2.formats[e2] || function(n3) {
            return n3.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(n4, e3, t2) {
              return e3 || t2.slice(1);
            });
          }(n2.formats[e2.toUpperCase()]);
        }, s2 = function() {
          var n2 = this;
          return { months: function(e2) {
            return e2 ? e2.format("MMMM") : u2(n2, "months");
          }, monthsShort: function(e2) {
            return e2 ? e2.format("MMM") : u2(n2, "monthsShort", "months", 3);
          }, firstDayOfWeek: function() {
            return n2.$locale().weekStart || 0;
          }, weekdays: function(e2) {
            return e2 ? e2.format("dddd") : u2(n2, "weekdays");
          }, weekdaysMin: function(e2) {
            return e2 ? e2.format("dd") : u2(n2, "weekdaysMin", "weekdays", 2);
          }, weekdaysShort: function(e2) {
            return e2 ? e2.format("ddd") : u2(n2, "weekdaysShort", "weekdays", 3);
          }, longDateFormat: function(e2) {
            return a2(n2.$locale(), e2);
          }, meridiem: this.$locale().meridiem, ordinal: this.$locale().ordinal };
        };
        r.localeData = function() {
          return s2.bind(this)();
        }, t.localeData = function() {
          var n2 = i();
          return { firstDayOfWeek: function() {
            return n2.weekStart || 0;
          }, weekdays: function() {
            return t.weekdays();
          }, weekdaysShort: function() {
            return t.weekdaysShort();
          }, weekdaysMin: function() {
            return t.weekdaysMin();
          }, months: function() {
            return t.months();
          }, monthsShort: function() {
            return t.monthsShort();
          }, longDateFormat: function(e2) {
            return a2(n2, e2);
          }, meridiem: n2.meridiem, ordinal: n2.ordinal };
        }, t.months = function() {
          return u2(i(), "months");
        }, t.monthsShort = function() {
          return u2(i(), "monthsShort", "months", 3);
        }, t.weekdays = function(n2) {
          return u2(i(), "weekdays", null, null, n2);
        }, t.weekdaysShort = function(n2) {
          return u2(i(), "weekdaysShort", "weekdays", 3, n2);
        }, t.weekdaysMin = function(n2) {
          return u2(i(), "weekdaysMin", "weekdays", 2, n2);
        };
      };
    });
  }
});

// node_modules/dayjs/plugin/customParseFormat.js
var require_customParseFormat = __commonJS({
  "node_modules/dayjs/plugin/customParseFormat.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_customParseFormat = t();
    }(exports, function() {
      "use strict";
      var e = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, t = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, n = /\d\d/, r = /\d\d?/, i = /\d*[^-_:/,()\s\d]+/, o2 = {}, s2 = function(e2) {
        return (e2 = +e2) + (e2 > 68 ? 1900 : 2e3);
      };
      var a2 = function(e2) {
        return function(t2) {
          this[e2] = +t2;
        };
      }, f2 = [/[+-]\d\d:?(\d\d)?|Z/, function(e2) {
        (this.zone || (this.zone = {})).offset = function(e3) {
          if (!e3)
            return 0;
          if ("Z" === e3)
            return 0;
          var t2 = e3.match(/([+-]|\d\d)/g), n2 = 60 * t2[1] + (+t2[2] || 0);
          return 0 === n2 ? 0 : "+" === t2[0] ? -n2 : n2;
        }(e2);
      }], h2 = function(e2) {
        var t2 = o2[e2];
        return t2 && (t2.indexOf ? t2 : t2.s.concat(t2.f));
      }, u2 = function(e2, t2) {
        var n2, r2 = o2.meridiem;
        if (r2) {
          for (var i2 = 1; i2 <= 24; i2 += 1)
            if (e2.indexOf(r2(i2, 0, t2)) > -1) {
              n2 = i2 > 12;
              break;
            }
        } else
          n2 = e2 === (t2 ? "pm" : "PM");
        return n2;
      }, d2 = { A: [i, function(e2) {
        this.afternoon = u2(e2, false);
      }], a: [i, function(e2) {
        this.afternoon = u2(e2, true);
      }], S: [/\d/, function(e2) {
        this.milliseconds = 100 * +e2;
      }], SS: [n, function(e2) {
        this.milliseconds = 10 * +e2;
      }], SSS: [/\d{3}/, function(e2) {
        this.milliseconds = +e2;
      }], s: [r, a2("seconds")], ss: [r, a2("seconds")], m: [r, a2("minutes")], mm: [r, a2("minutes")], H: [r, a2("hours")], h: [r, a2("hours")], HH: [r, a2("hours")], hh: [r, a2("hours")], D: [r, a2("day")], DD: [n, a2("day")], Do: [i, function(e2) {
        var t2 = o2.ordinal, n2 = e2.match(/\d+/);
        if (this.day = n2[0], t2)
          for (var r2 = 1; r2 <= 31; r2 += 1)
            t2(r2).replace(/\[|\]/g, "") === e2 && (this.day = r2);
      }], M: [r, a2("month")], MM: [n, a2("month")], MMM: [i, function(e2) {
        var t2 = h2("months"), n2 = (h2("monthsShort") || t2.map(function(e3) {
          return e3.slice(0, 3);
        })).indexOf(e2) + 1;
        if (n2 < 1)
          throw new Error();
        this.month = n2 % 12 || n2;
      }], MMMM: [i, function(e2) {
        var t2 = h2("months").indexOf(e2) + 1;
        if (t2 < 1)
          throw new Error();
        this.month = t2 % 12 || t2;
      }], Y: [/[+-]?\d+/, a2("year")], YY: [n, function(e2) {
        this.year = s2(e2);
      }], YYYY: [/\d{4}/, a2("year")], Z: f2, ZZ: f2 };
      function c2(n2) {
        var r2, i2;
        r2 = n2, i2 = o2 && o2.formats;
        for (var s3 = (n2 = r2.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(t2, n3, r3) {
          var o3 = r3 && r3.toUpperCase();
          return n3 || i2[r3] || e[r3] || i2[o3].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(e2, t3, n4) {
            return t3 || n4.slice(1);
          });
        })).match(t), a3 = s3.length, f3 = 0; f3 < a3; f3 += 1) {
          var h3 = s3[f3], u3 = d2[h3], c3 = u3 && u3[0], l2 = u3 && u3[1];
          s3[f3] = l2 ? { regex: c3, parser: l2 } : h3.replace(/^\[|\]$/g, "");
        }
        return function(e2) {
          for (var t2 = {}, n3 = 0, r3 = 0; n3 < a3; n3 += 1) {
            var i3 = s3[n3];
            if ("string" == typeof i3)
              r3 += i3.length;
            else {
              var o3 = i3.regex, f4 = i3.parser, h4 = e2.slice(r3), u4 = o3.exec(h4)[0];
              f4.call(t2, u4), e2 = e2.replace(u4, "");
            }
          }
          return function(e3) {
            var t3 = e3.afternoon;
            if (void 0 !== t3) {
              var n4 = e3.hours;
              t3 ? n4 < 12 && (e3.hours += 12) : 12 === n4 && (e3.hours = 0), delete e3.afternoon;
            }
          }(t2), t2;
        };
      }
      return function(e2, t2, n2) {
        n2.p.customParseFormat = true, e2 && e2.parseTwoDigitYear && (s2 = e2.parseTwoDigitYear);
        var r2 = t2.prototype, i2 = r2.parse;
        r2.parse = function(e3) {
          var t3 = e3.date, r3 = e3.utc, s3 = e3.args;
          this.$u = r3;
          var a3 = s3[1];
          if ("string" == typeof a3) {
            var f3 = true === s3[2], h3 = true === s3[3], u3 = f3 || h3, d3 = s3[2];
            h3 && (d3 = s3[2]), o2 = this.$locale(), !f3 && d3 && (o2 = n2.Ls[d3]), this.$d = function(e4, t4, n3) {
              try {
                if (["x", "X"].indexOf(t4) > -1)
                  return new Date(("X" === t4 ? 1e3 : 1) * e4);
                var r4 = c2(t4)(e4), i3 = r4.year, o3 = r4.month, s4 = r4.day, a4 = r4.hours, f4 = r4.minutes, h4 = r4.seconds, u4 = r4.milliseconds, d4 = r4.zone, l3 = new Date(), m3 = s4 || (i3 || o3 ? 1 : l3.getDate()), M3 = i3 || l3.getFullYear(), Y2 = 0;
                i3 && !o3 || (Y2 = o3 > 0 ? o3 - 1 : l3.getMonth());
                var p2 = a4 || 0, v2 = f4 || 0, D2 = h4 || 0, g = u4 || 0;
                return d4 ? new Date(Date.UTC(M3, Y2, m3, p2, v2, D2, g + 60 * d4.offset * 1e3)) : n3 ? new Date(Date.UTC(M3, Y2, m3, p2, v2, D2, g)) : new Date(M3, Y2, m3, p2, v2, D2, g);
              } catch (e5) {
                return new Date("");
              }
            }(t3, a3, r3), this.init(), d3 && true !== d3 && (this.$L = this.locale(d3).$L), u3 && t3 != this.format(a3) && (this.$d = new Date("")), o2 = {};
          } else if (a3 instanceof Array)
            for (var l2 = a3.length, m2 = 1; m2 <= l2; m2 += 1) {
              s3[1] = a3[m2 - 1];
              var M2 = n2.apply(this, s3);
              if (M2.isValid()) {
                this.$d = M2.$d, this.$L = M2.$L, this.init();
                break;
              }
              m2 === l2 && (this.$d = new Date(""));
            }
          else
            i2.call(this, e3);
        };
      };
    });
  }
});

// node_modules/dayjs/plugin/advancedFormat.js
var require_advancedFormat = __commonJS({
  "node_modules/dayjs/plugin/advancedFormat.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_advancedFormat = t();
    }(exports, function() {
      "use strict";
      return function(e, t, r) {
        var n = t.prototype, s2 = n.format;
        r.en.ordinal = function(e2) {
          var t2 = ["th", "st", "nd", "rd"], r2 = e2 % 100;
          return "[" + e2 + (t2[(r2 - 20) % 10] || t2[r2] || t2[0]) + "]";
        }, n.format = function(e2) {
          var t2 = this, r2 = this.$locale();
          if (!this.isValid())
            return s2.bind(this)(e2);
          var n2 = this.$utils(), a2 = (e2 || "YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g, function(e3) {
            switch (e3) {
              case "Q":
                return Math.ceil((t2.$M + 1) / 3);
              case "Do":
                return r2.ordinal(t2.$D);
              case "gggg":
                return t2.weekYear();
              case "GGGG":
                return t2.isoWeekYear();
              case "wo":
                return r2.ordinal(t2.week(), "W");
              case "w":
              case "ww":
                return n2.s(t2.week(), "w" === e3 ? 1 : 2, "0");
              case "W":
              case "WW":
                return n2.s(t2.isoWeek(), "W" === e3 ? 1 : 2, "0");
              case "k":
              case "kk":
                return n2.s(String(0 === t2.$H ? 24 : t2.$H), "k" === e3 ? 1 : 2, "0");
              case "X":
                return Math.floor(t2.$d.getTime() / 1e3);
              case "x":
                return t2.$d.getTime();
              case "z":
                return "[" + t2.offsetName() + "]";
              case "zzz":
                return "[" + t2.offsetName("long") + "]";
              default:
                return e3;
            }
          });
          return s2.bind(this)(a2);
        };
      };
    });
  }
});

// node_modules/dayjs/plugin/weekOfYear.js
var require_weekOfYear = __commonJS({
  "node_modules/dayjs/plugin/weekOfYear.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_weekOfYear = t();
    }(exports, function() {
      "use strict";
      var e = "week", t = "year";
      return function(i, n, r) {
        var f2 = n.prototype;
        f2.week = function(i2) {
          if (void 0 === i2 && (i2 = null), null !== i2)
            return this.add(7 * (i2 - this.week()), "day");
          var n2 = this.$locale().yearStart || 1;
          if (11 === this.month() && this.date() > 25) {
            var f3 = r(this).startOf(t).add(1, t).date(n2), s2 = r(this).endOf(e);
            if (f3.isBefore(s2))
              return 1;
          }
          var a2 = r(this).startOf(t).date(n2).startOf(e).subtract(1, "millisecond"), o2 = this.diff(a2, e, true);
          return o2 < 0 ? r(this).startOf("week").week() : Math.ceil(o2);
        }, f2.weeks = function(e2) {
          return void 0 === e2 && (e2 = null), this.week(e2);
        };
      };
    });
  }
});

// node_modules/dayjs/plugin/weekYear.js
var require_weekYear = __commonJS({
  "node_modules/dayjs/plugin/weekYear.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_weekYear = t();
    }(exports, function() {
      "use strict";
      return function(e, t) {
        t.prototype.weekYear = function() {
          var e2 = this.month(), t2 = this.week(), n = this.year();
          return 1 === t2 && 11 === e2 ? n + 1 : 0 === e2 && t2 >= 52 ? n - 1 : n;
        };
      };
    });
  }
});

// node_modules/dayjs/plugin/dayOfYear.js
var require_dayOfYear = __commonJS({
  "node_modules/dayjs/plugin/dayOfYear.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_dayOfYear = t();
    }(exports, function() {
      "use strict";
      return function(e, t, n) {
        t.prototype.dayOfYear = function(e2) {
          var t2 = Math.round((n(this).startOf("day") - n(this).startOf("year")) / 864e5) + 1;
          return null == e2 ? t2 : this.add(e2 - t2, "day");
        };
      };
    });
  }
});

// node_modules/dayjs/plugin/isSameOrAfter.js
var require_isSameOrAfter = __commonJS({
  "node_modules/dayjs/plugin/isSameOrAfter.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_isSameOrAfter = t();
    }(exports, function() {
      "use strict";
      return function(e, t) {
        t.prototype.isSameOrAfter = function(e2, t2) {
          return this.isSame(e2, t2) || this.isAfter(e2, t2);
        };
      };
    });
  }
});

// node_modules/dayjs/plugin/isSameOrBefore.js
var require_isSameOrBefore = __commonJS({
  "node_modules/dayjs/plugin/isSameOrBefore.js"(exports, module) {
    !function(e, i) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = i() : "function" == typeof define && define.amd ? define(i) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_isSameOrBefore = i();
    }(exports, function() {
      "use strict";
      return function(e, i) {
        i.prototype.isSameOrBefore = function(e2, i2) {
          return this.isSame(e2, i2) || this.isBefore(e2, i2);
        };
      };
    });
  }
});

// node_modules/async-validator/dist-web/index.js
var dist_web_exports = {};
__export(dist_web_exports, {
  default: () => Schema
});
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o2) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o3) {
    return o3.__proto__ || Object.getPrototypeOf(o3);
  };
  return _getPrototypeOf(o2);
}
function _setPrototypeOf(o2, p2) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o3, p3) {
    o3.__proto__ = p3;
    return o3;
  };
  return _setPrototypeOf(o2, p2);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct.bind();
  } else {
    _construct = function _construct2(Parent2, args2, Class2) {
      var a2 = [null];
      a2.push.apply(a2, args2);
      var Constructor = Function.bind.apply(Parent2, a2);
      var instance = new Constructor();
      if (Class2)
        _setPrototypeOf(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
  _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
    if (Class2 === null || !_isNativeFunction(Class2))
      return Class2;
    if (typeof Class2 !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class2))
        return _cache.get(Class2);
      _cache.set(Class2, Wrapper);
    }
    function Wrapper() {
      return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class2.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class2);
  };
  return _wrapNativeSuper(Class);
}
function convertFieldsError(errors) {
  if (!errors || !errors.length)
    return null;
  var fields = {};
  errors.forEach(function(error) {
    var field = error.field;
    fields[field] = fields[field] || [];
    fields[field].push(error);
  });
  return fields;
}
function format(template) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  var i = 0;
  var len = args.length;
  if (typeof template === "function") {
    return template.apply(null, args);
  }
  if (typeof template === "string") {
    var str = template.replace(formatRegExp, function(x2) {
      if (x2 === "%%") {
        return "%";
      }
      if (i >= len) {
        return x2;
      }
      switch (x2) {
        case "%s":
          return String(args[i++]);
        case "%d":
          return Number(args[i++]);
        case "%j":
          try {
            return JSON.stringify(args[i++]);
          } catch (_2) {
            return "[Circular]";
          }
          break;
        default:
          return x2;
      }
    });
    return str;
  }
  return template;
}
function isNativeStringType(type4) {
  return type4 === "string" || type4 === "url" || type4 === "hex" || type4 === "email" || type4 === "date" || type4 === "pattern";
}
function isEmptyValue(value, type4) {
  if (value === void 0 || value === null) {
    return true;
  }
  if (type4 === "array" && Array.isArray(value) && !value.length) {
    return true;
  }
  if (isNativeStringType(type4) && typeof value === "string" && !value) {
    return true;
  }
  return false;
}
function asyncParallelArray(arr, func, callback) {
  var results = [];
  var total = 0;
  var arrLength = arr.length;
  function count(errors) {
    results.push.apply(results, errors || []);
    total++;
    if (total === arrLength) {
      callback(results);
    }
  }
  arr.forEach(function(a2) {
    func(a2, count);
  });
}
function asyncSerialArray(arr, func, callback) {
  var index = 0;
  var arrLength = arr.length;
  function next(errors) {
    if (errors && errors.length) {
      callback(errors);
      return;
    }
    var original = index;
    index = index + 1;
    if (original < arrLength) {
      func(arr[original], next);
    } else {
      callback([]);
    }
  }
  next([]);
}
function flattenObjArr(objArr) {
  var ret = [];
  Object.keys(objArr).forEach(function(k) {
    ret.push.apply(ret, objArr[k] || []);
  });
  return ret;
}
function asyncMap(objArr, option, func, callback, source) {
  if (option.first) {
    var _pending = new Promise(function(resolve, reject) {
      var next = function next2(errors) {
        callback(errors);
        return errors.length ? reject(new AsyncValidationError(errors, convertFieldsError(errors))) : resolve(source);
      };
      var flattenArr = flattenObjArr(objArr);
      asyncSerialArray(flattenArr, func, next);
    });
    _pending["catch"](function(e) {
      return e;
    });
    return _pending;
  }
  var firstFields = option.firstFields === true ? Object.keys(objArr) : option.firstFields || [];
  var objArrKeys = Object.keys(objArr);
  var objArrLength = objArrKeys.length;
  var total = 0;
  var results = [];
  var pending = new Promise(function(resolve, reject) {
    var next = function next2(errors) {
      results.push.apply(results, errors);
      total++;
      if (total === objArrLength) {
        callback(results);
        return results.length ? reject(new AsyncValidationError(results, convertFieldsError(results))) : resolve(source);
      }
    };
    if (!objArrKeys.length) {
      callback(results);
      resolve(source);
    }
    objArrKeys.forEach(function(key) {
      var arr = objArr[key];
      if (firstFields.indexOf(key) !== -1) {
        asyncSerialArray(arr, func, next);
      } else {
        asyncParallelArray(arr, func, next);
      }
    });
  });
  pending["catch"](function(e) {
    return e;
  });
  return pending;
}
function isErrorObj(obj) {
  return !!(obj && obj.message !== void 0);
}
function getValue(value, path) {
  var v2 = value;
  for (var i = 0; i < path.length; i++) {
    if (v2 == void 0) {
      return v2;
    }
    v2 = v2[path[i]];
  }
  return v2;
}
function complementError(rule, source) {
  return function(oe) {
    var fieldValue;
    if (rule.fullFields) {
      fieldValue = getValue(source, rule.fullFields);
    } else {
      fieldValue = source[oe.field || rule.fullField];
    }
    if (isErrorObj(oe)) {
      oe.field = oe.field || rule.fullField;
      oe.fieldValue = fieldValue;
      return oe;
    }
    return {
      message: typeof oe === "function" ? oe() : oe,
      fieldValue,
      field: oe.field || rule.fullField
    };
  };
}
function deepMerge(target, source) {
  if (source) {
    for (var s2 in source) {
      if (source.hasOwnProperty(s2)) {
        var value = source[s2];
        if (typeof value === "object" && typeof target[s2] === "object") {
          target[s2] = _extends({}, target[s2], value);
        } else {
          target[s2] = value;
        }
      }
    }
  }
  return target;
}
function newMessages() {
  return {
    "default": "Validation error on field %s",
    required: "%s is required",
    "enum": "%s must be one of %s",
    whitespace: "%s cannot be empty",
    date: {
      format: "%s date %s is invalid for format %s",
      parse: "%s date could not be parsed, %s is invalid ",
      invalid: "%s date %s is invalid"
    },
    types: {
      string: "%s is not a %s",
      method: "%s is not a %s (function)",
      array: "%s is not an %s",
      object: "%s is not an %s",
      number: "%s is not a %s",
      date: "%s is not a %s",
      "boolean": "%s is not a %s",
      integer: "%s is not an %s",
      "float": "%s is not a %s",
      regexp: "%s is not a valid %s",
      email: "%s is not a valid %s",
      url: "%s is not a valid %s",
      hex: "%s is not a valid %s"
    },
    string: {
      len: "%s must be exactly %s characters",
      min: "%s must be at least %s characters",
      max: "%s cannot be longer than %s characters",
      range: "%s must be between %s and %s characters"
    },
    number: {
      len: "%s must equal %s",
      min: "%s cannot be less than %s",
      max: "%s cannot be greater than %s",
      range: "%s must be between %s and %s"
    },
    array: {
      len: "%s must be exactly %s in length",
      min: "%s cannot be less than %s in length",
      max: "%s cannot be greater than %s in length",
      range: "%s must be between %s and %s in length"
    },
    pattern: {
      mismatch: "%s value %s does not match pattern %s"
    },
    clone: function clone() {
      var cloned = JSON.parse(JSON.stringify(this));
      cloned.clone = this.clone;
      return cloned;
    }
  };
}
var formatRegExp, warning, AsyncValidationError, required$1, whitespace, urlReg, getUrlRegex, pattern$2, types, type$1, range, ENUM$1, enumerable$1, pattern$1, rules, string, method2, number2, _boolean, regexp2, integer2, floatFn, array2, object2, ENUM, enumerable2, pattern2, date2, required2, type2, any, validators, messages, Schema;
var init_dist_web = __esm({
  "node_modules/async-validator/dist-web/index.js"() {
    formatRegExp = /%[sdj%]/g;
    warning = function warning2() {
    };
    if (typeof process !== "undefined" && process.env && true && typeof window !== "undefined" && typeof document !== "undefined") {
      warning = function warning3(type4, errors) {
        if (typeof console !== "undefined" && console.warn && typeof ASYNC_VALIDATOR_NO_WARNING === "undefined") {
          if (errors.every(function(e) {
            return typeof e === "string";
          })) {
            console.warn(type4, errors);
          }
        }
      };
    }
    AsyncValidationError = function(_Error) {
      _inheritsLoose(AsyncValidationError2, _Error);
      function AsyncValidationError2(errors, fields) {
        var _this;
        _this = _Error.call(this, "Async Validation Error") || this;
        _this.errors = errors;
        _this.fields = fields;
        return _this;
      }
      return AsyncValidationError2;
    }(_wrapNativeSuper(Error));
    required$1 = function required(rule, value, source, errors, options, type4) {
      if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type4 || rule.type))) {
        errors.push(format(options.messages.required, rule.fullField));
      }
    };
    whitespace = function whitespace2(rule, value, source, errors, options) {
      if (/^\s+$/.test(value) || value === "") {
        errors.push(format(options.messages.whitespace, rule.fullField));
      }
    };
    getUrlRegex = function() {
      if (urlReg) {
        return urlReg;
      }
      var word = "[a-fA-F\\d:]";
      var b2 = function b3(options) {
        return options && options.includeBoundaries ? "(?:(?<=\\s|^)(?=" + word + ")|(?<=" + word + ")(?=\\s|$))" : "";
      };
      var v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
      var v6seg = "[a-fA-F\\d]{1,4}";
      var v6 = ("\n(?:\n(?:" + v6seg + ":){7}(?:" + v6seg + "|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8\n(?:" + v6seg + ":){6}(?:" + v4 + "|:" + v6seg + "|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4\n(?:" + v6seg + ":){5}(?::" + v4 + "|(?::" + v6seg + "){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4\n(?:" + v6seg + ":){4}(?:(?::" + v6seg + "){0,1}:" + v4 + "|(?::" + v6seg + "){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4\n(?:" + v6seg + ":){3}(?:(?::" + v6seg + "){0,2}:" + v4 + "|(?::" + v6seg + "){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4\n(?:" + v6seg + ":){2}(?:(?::" + v6seg + "){0,3}:" + v4 + "|(?::" + v6seg + "){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4\n(?:" + v6seg + ":){1}(?:(?::" + v6seg + "){0,4}:" + v4 + "|(?::" + v6seg + "){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4\n(?::(?:(?::" + v6seg + "){0,5}:" + v4 + "|(?::" + v6seg + "){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4\n)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1\n").replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
      var v46Exact = new RegExp("(?:^" + v4 + "$)|(?:^" + v6 + "$)");
      var v4exact = new RegExp("^" + v4 + "$");
      var v6exact = new RegExp("^" + v6 + "$");
      var ip = function ip2(options) {
        return options && options.exact ? v46Exact : new RegExp("(?:" + b2(options) + v4 + b2(options) + ")|(?:" + b2(options) + v6 + b2(options) + ")", "g");
      };
      ip.v4 = function(options) {
        return options && options.exact ? v4exact : new RegExp("" + b2(options) + v4 + b2(options), "g");
      };
      ip.v6 = function(options) {
        return options && options.exact ? v6exact : new RegExp("" + b2(options) + v6 + b2(options), "g");
      };
      var protocol = "(?:(?:[a-z]+:)?//)";
      var auth = "(?:\\S+(?::\\S*)?@)?";
      var ipv4 = ip.v4().source;
      var ipv6 = ip.v6().source;
      var host = "(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)";
      var domain = "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
      var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";
      var port = "(?::\\d{2,5})?";
      var path = '(?:[/?#][^\\s"]*)?';
      var regex = "(?:" + protocol + "|www\\.)" + auth + "(?:localhost|" + ipv4 + "|" + ipv6 + "|" + host + domain + tld + ")" + port + path;
      urlReg = new RegExp("(?:^" + regex + "$)", "i");
      return urlReg;
    };
    pattern$2 = {
      email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
      hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
    };
    types = {
      integer: function integer(value) {
        return types.number(value) && parseInt(value, 10) === value;
      },
      "float": function float(value) {
        return types.number(value) && !types.integer(value);
      },
      array: function array(value) {
        return Array.isArray(value);
      },
      regexp: function regexp(value) {
        if (value instanceof RegExp) {
          return true;
        }
        try {
          return !!new RegExp(value);
        } catch (e) {
          return false;
        }
      },
      date: function date(value) {
        return typeof value.getTime === "function" && typeof value.getMonth === "function" && typeof value.getYear === "function" && !isNaN(value.getTime());
      },
      number: function number(value) {
        if (isNaN(value)) {
          return false;
        }
        return typeof value === "number";
      },
      object: function object(value) {
        return typeof value === "object" && !types.array(value);
      },
      method: function method(value) {
        return typeof value === "function";
      },
      email: function email(value) {
        return typeof value === "string" && value.length <= 320 && !!value.match(pattern$2.email);
      },
      url: function url(value) {
        return typeof value === "string" && value.length <= 2048 && !!value.match(getUrlRegex());
      },
      hex: function hex(value) {
        return typeof value === "string" && !!value.match(pattern$2.hex);
      }
    };
    type$1 = function type(rule, value, source, errors, options) {
      if (rule.required && value === void 0) {
        required$1(rule, value, source, errors, options);
        return;
      }
      var custom = ["integer", "float", "array", "regexp", "object", "method", "email", "number", "date", "url", "hex"];
      var ruleType = rule.type;
      if (custom.indexOf(ruleType) > -1) {
        if (!types[ruleType](value)) {
          errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
        }
      } else if (ruleType && typeof value !== rule.type) {
        errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
      }
    };
    range = function range2(rule, value, source, errors, options) {
      var len = typeof rule.len === "number";
      var min = typeof rule.min === "number";
      var max = typeof rule.max === "number";
      var spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      var val = value;
      var key = null;
      var num = typeof value === "number";
      var str = typeof value === "string";
      var arr = Array.isArray(value);
      if (num) {
        key = "number";
      } else if (str) {
        key = "string";
      } else if (arr) {
        key = "array";
      }
      if (!key) {
        return false;
      }
      if (arr) {
        val = value.length;
      }
      if (str) {
        val = value.replace(spRegexp, "_").length;
      }
      if (len) {
        if (val !== rule.len) {
          errors.push(format(options.messages[key].len, rule.fullField, rule.len));
        }
      } else if (min && !max && val < rule.min) {
        errors.push(format(options.messages[key].min, rule.fullField, rule.min));
      } else if (max && !min && val > rule.max) {
        errors.push(format(options.messages[key].max, rule.fullField, rule.max));
      } else if (min && max && (val < rule.min || val > rule.max)) {
        errors.push(format(options.messages[key].range, rule.fullField, rule.min, rule.max));
      }
    };
    ENUM$1 = "enum";
    enumerable$1 = function enumerable(rule, value, source, errors, options) {
      rule[ENUM$1] = Array.isArray(rule[ENUM$1]) ? rule[ENUM$1] : [];
      if (rule[ENUM$1].indexOf(value) === -1) {
        errors.push(format(options.messages[ENUM$1], rule.fullField, rule[ENUM$1].join(", ")));
      }
    };
    pattern$1 = function pattern(rule, value, source, errors, options) {
      if (rule.pattern) {
        if (rule.pattern instanceof RegExp) {
          rule.pattern.lastIndex = 0;
          if (!rule.pattern.test(value)) {
            errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
          }
        } else if (typeof rule.pattern === "string") {
          var _pattern = new RegExp(rule.pattern);
          if (!_pattern.test(value)) {
            errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
          }
        }
      }
    };
    rules = {
      required: required$1,
      whitespace,
      type: type$1,
      range,
      "enum": enumerable$1,
      pattern: pattern$1
    };
    string = function string2(rule, value, callback, source, options) {
      var errors = [];
      var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      if (validate) {
        if (isEmptyValue(value, "string") && !rule.required) {
          return callback();
        }
        rules.required(rule, value, source, errors, options, "string");
        if (!isEmptyValue(value, "string")) {
          rules.type(rule, value, source, errors, options);
          rules.range(rule, value, source, errors, options);
          rules.pattern(rule, value, source, errors, options);
          if (rule.whitespace === true) {
            rules.whitespace(rule, value, source, errors, options);
          }
        }
      }
      callback(errors);
    };
    method2 = function method3(rule, value, callback, source, options) {
      var errors = [];
      var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      if (validate) {
        if (isEmptyValue(value) && !rule.required) {
          return callback();
        }
        rules.required(rule, value, source, errors, options);
        if (value !== void 0) {
          rules.type(rule, value, source, errors, options);
        }
      }
      callback(errors);
    };
    number2 = function number3(rule, value, callback, source, options) {
      var errors = [];
      var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      if (validate) {
        if (value === "") {
          value = void 0;
        }
        if (isEmptyValue(value) && !rule.required) {
          return callback();
        }
        rules.required(rule, value, source, errors, options);
        if (value !== void 0) {
          rules.type(rule, value, source, errors, options);
          rules.range(rule, value, source, errors, options);
        }
      }
      callback(errors);
    };
    _boolean = function _boolean2(rule, value, callback, source, options) {
      var errors = [];
      var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      if (validate) {
        if (isEmptyValue(value) && !rule.required) {
          return callback();
        }
        rules.required(rule, value, source, errors, options);
        if (value !== void 0) {
          rules.type(rule, value, source, errors, options);
        }
      }
      callback(errors);
    };
    regexp2 = function regexp3(rule, value, callback, source, options) {
      var errors = [];
      var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      if (validate) {
        if (isEmptyValue(value) && !rule.required) {
          return callback();
        }
        rules.required(rule, value, source, errors, options);
        if (!isEmptyValue(value)) {
          rules.type(rule, value, source, errors, options);
        }
      }
      callback(errors);
    };
    integer2 = function integer3(rule, value, callback, source, options) {
      var errors = [];
      var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      if (validate) {
        if (isEmptyValue(value) && !rule.required) {
          return callback();
        }
        rules.required(rule, value, source, errors, options);
        if (value !== void 0) {
          rules.type(rule, value, source, errors, options);
          rules.range(rule, value, source, errors, options);
        }
      }
      callback(errors);
    };
    floatFn = function floatFn2(rule, value, callback, source, options) {
      var errors = [];
      var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      if (validate) {
        if (isEmptyValue(value) && !rule.required) {
          return callback();
        }
        rules.required(rule, value, source, errors, options);
        if (value !== void 0) {
          rules.type(rule, value, source, errors, options);
          rules.range(rule, value, source, errors, options);
        }
      }
      callback(errors);
    };
    array2 = function array3(rule, value, callback, source, options) {
      var errors = [];
      var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      if (validate) {
        if ((value === void 0 || value === null) && !rule.required) {
          return callback();
        }
        rules.required(rule, value, source, errors, options, "array");
        if (value !== void 0 && value !== null) {
          rules.type(rule, value, source, errors, options);
          rules.range(rule, value, source, errors, options);
        }
      }
      callback(errors);
    };
    object2 = function object3(rule, value, callback, source, options) {
      var errors = [];
      var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      if (validate) {
        if (isEmptyValue(value) && !rule.required) {
          return callback();
        }
        rules.required(rule, value, source, errors, options);
        if (value !== void 0) {
          rules.type(rule, value, source, errors, options);
        }
      }
      callback(errors);
    };
    ENUM = "enum";
    enumerable2 = function enumerable3(rule, value, callback, source, options) {
      var errors = [];
      var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      if (validate) {
        if (isEmptyValue(value) && !rule.required) {
          return callback();
        }
        rules.required(rule, value, source, errors, options);
        if (value !== void 0) {
          rules[ENUM](rule, value, source, errors, options);
        }
      }
      callback(errors);
    };
    pattern2 = function pattern3(rule, value, callback, source, options) {
      var errors = [];
      var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      if (validate) {
        if (isEmptyValue(value, "string") && !rule.required) {
          return callback();
        }
        rules.required(rule, value, source, errors, options);
        if (!isEmptyValue(value, "string")) {
          rules.pattern(rule, value, source, errors, options);
        }
      }
      callback(errors);
    };
    date2 = function date3(rule, value, callback, source, options) {
      var errors = [];
      var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      if (validate) {
        if (isEmptyValue(value, "date") && !rule.required) {
          return callback();
        }
        rules.required(rule, value, source, errors, options);
        if (!isEmptyValue(value, "date")) {
          var dateObject;
          if (value instanceof Date) {
            dateObject = value;
          } else {
            dateObject = new Date(value);
          }
          rules.type(rule, dateObject, source, errors, options);
          if (dateObject) {
            rules.range(rule, dateObject.getTime(), source, errors, options);
          }
        }
      }
      callback(errors);
    };
    required2 = function required3(rule, value, callback, source, options) {
      var errors = [];
      var type4 = Array.isArray(value) ? "array" : typeof value;
      rules.required(rule, value, source, errors, options, type4);
      callback(errors);
    };
    type2 = function type3(rule, value, callback, source, options) {
      var ruleType = rule.type;
      var errors = [];
      var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      if (validate) {
        if (isEmptyValue(value, ruleType) && !rule.required) {
          return callback();
        }
        rules.required(rule, value, source, errors, options, ruleType);
        if (!isEmptyValue(value, ruleType)) {
          rules.type(rule, value, source, errors, options);
        }
      }
      callback(errors);
    };
    any = function any2(rule, value, callback, source, options) {
      var errors = [];
      var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      if (validate) {
        if (isEmptyValue(value) && !rule.required) {
          return callback();
        }
        rules.required(rule, value, source, errors, options);
      }
      callback(errors);
    };
    validators = {
      string,
      method: method2,
      number: number2,
      "boolean": _boolean,
      regexp: regexp2,
      integer: integer2,
      "float": floatFn,
      array: array2,
      object: object2,
      "enum": enumerable2,
      pattern: pattern2,
      date: date2,
      url: type2,
      hex: type2,
      email: type2,
      required: required2,
      any
    };
    messages = newMessages();
    Schema = function() {
      function Schema2(descriptor) {
        this.rules = null;
        this._messages = messages;
        this.define(descriptor);
      }
      var _proto = Schema2.prototype;
      _proto.define = function define2(rules2) {
        var _this = this;
        if (!rules2) {
          throw new Error("Cannot configure a schema with no rules");
        }
        if (typeof rules2 !== "object" || Array.isArray(rules2)) {
          throw new Error("Rules must be an object");
        }
        this.rules = {};
        Object.keys(rules2).forEach(function(name) {
          var item = rules2[name];
          _this.rules[name] = Array.isArray(item) ? item : [item];
        });
      };
      _proto.messages = function messages2(_messages) {
        if (_messages) {
          this._messages = deepMerge(newMessages(), _messages);
        }
        return this._messages;
      };
      _proto.validate = function validate(source_, o2, oc) {
        var _this2 = this;
        if (o2 === void 0) {
          o2 = {};
        }
        if (oc === void 0) {
          oc = function oc2() {
          };
        }
        var source = source_;
        var options = o2;
        var callback = oc;
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        if (!this.rules || Object.keys(this.rules).length === 0) {
          if (callback) {
            callback(null, source);
          }
          return Promise.resolve(source);
        }
        function complete(results) {
          var errors = [];
          var fields = {};
          function add(e) {
            if (Array.isArray(e)) {
              var _errors;
              errors = (_errors = errors).concat.apply(_errors, e);
            } else {
              errors.push(e);
            }
          }
          for (var i = 0; i < results.length; i++) {
            add(results[i]);
          }
          if (!errors.length) {
            callback(null, source);
          } else {
            fields = convertFieldsError(errors);
            callback(errors, fields);
          }
        }
        if (options.messages) {
          var messages$1 = this.messages();
          if (messages$1 === messages) {
            messages$1 = newMessages();
          }
          deepMerge(messages$1, options.messages);
          options.messages = messages$1;
        } else {
          options.messages = this.messages();
        }
        var series = {};
        var keys = options.keys || Object.keys(this.rules);
        keys.forEach(function(z) {
          var arr = _this2.rules[z];
          var value = source[z];
          arr.forEach(function(r) {
            var rule = r;
            if (typeof rule.transform === "function") {
              if (source === source_) {
                source = _extends({}, source);
              }
              value = source[z] = rule.transform(value);
            }
            if (typeof rule === "function") {
              rule = {
                validator: rule
              };
            } else {
              rule = _extends({}, rule);
            }
            rule.validator = _this2.getValidationMethod(rule);
            if (!rule.validator) {
              return;
            }
            rule.field = z;
            rule.fullField = rule.fullField || z;
            rule.type = _this2.getType(rule);
            series[z] = series[z] || [];
            series[z].push({
              rule,
              value,
              source,
              field: z
            });
          });
        });
        var errorFields = {};
        return asyncMap(series, options, function(data, doIt) {
          var rule = data.rule;
          var deep = (rule.type === "object" || rule.type === "array") && (typeof rule.fields === "object" || typeof rule.defaultField === "object");
          deep = deep && (rule.required || !rule.required && data.value);
          rule.field = data.field;
          function addFullField(key, schema) {
            return _extends({}, schema, {
              fullField: rule.fullField + "." + key,
              fullFields: rule.fullFields ? [].concat(rule.fullFields, [key]) : [key]
            });
          }
          function cb(e) {
            if (e === void 0) {
              e = [];
            }
            var errorList = Array.isArray(e) ? e : [e];
            if (!options.suppressWarning && errorList.length) {
              Schema2.warning("async-validator:", errorList);
            }
            if (errorList.length && rule.message !== void 0) {
              errorList = [].concat(rule.message);
            }
            var filledErrors = errorList.map(complementError(rule, source));
            if (options.first && filledErrors.length) {
              errorFields[rule.field] = 1;
              return doIt(filledErrors);
            }
            if (!deep) {
              doIt(filledErrors);
            } else {
              if (rule.required && !data.value) {
                if (rule.message !== void 0) {
                  filledErrors = [].concat(rule.message).map(complementError(rule, source));
                } else if (options.error) {
                  filledErrors = [options.error(rule, format(options.messages.required, rule.field))];
                }
                return doIt(filledErrors);
              }
              var fieldsSchema = {};
              if (rule.defaultField) {
                Object.keys(data.value).map(function(key) {
                  fieldsSchema[key] = rule.defaultField;
                });
              }
              fieldsSchema = _extends({}, fieldsSchema, data.rule.fields);
              var paredFieldsSchema = {};
              Object.keys(fieldsSchema).forEach(function(field) {
                var fieldSchema = fieldsSchema[field];
                var fieldSchemaList = Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema];
                paredFieldsSchema[field] = fieldSchemaList.map(addFullField.bind(null, field));
              });
              var schema = new Schema2(paredFieldsSchema);
              schema.messages(options.messages);
              if (data.rule.options) {
                data.rule.options.messages = options.messages;
                data.rule.options.error = options.error;
              }
              schema.validate(data.value, data.rule.options || options, function(errs) {
                var finalErrors = [];
                if (filledErrors && filledErrors.length) {
                  finalErrors.push.apply(finalErrors, filledErrors);
                }
                if (errs && errs.length) {
                  finalErrors.push.apply(finalErrors, errs);
                }
                doIt(finalErrors.length ? finalErrors : null);
              });
            }
          }
          var res;
          if (rule.asyncValidator) {
            res = rule.asyncValidator(rule, data.value, cb, data.source, options);
          } else if (rule.validator) {
            try {
              res = rule.validator(rule, data.value, cb, data.source, options);
            } catch (error) {
              console.error == null ? void 0 : console.error(error);
              if (!options.suppressValidatorError) {
                setTimeout(function() {
                  throw error;
                }, 0);
              }
              cb(error.message);
            }
            if (res === true) {
              cb();
            } else if (res === false) {
              cb(typeof rule.message === "function" ? rule.message(rule.fullField || rule.field) : rule.message || (rule.fullField || rule.field) + " fails");
            } else if (res instanceof Array) {
              cb(res);
            } else if (res instanceof Error) {
              cb(res.message);
            }
          }
          if (res && res.then) {
            res.then(function() {
              return cb();
            }, function(e) {
              return cb(e);
            });
          }
        }, function(results) {
          complete(results);
        }, source);
      };
      _proto.getType = function getType(rule) {
        if (rule.type === void 0 && rule.pattern instanceof RegExp) {
          rule.type = "pattern";
        }
        if (typeof rule.validator !== "function" && rule.type && !validators.hasOwnProperty(rule.type)) {
          throw new Error(format("Unknown rule type %s", rule.type));
        }
        return rule.type || "string";
      };
      _proto.getValidationMethod = function getValidationMethod(rule) {
        if (typeof rule.validator === "function") {
          return rule.validator;
        }
        var keys = Object.keys(rule);
        var messageIndex = keys.indexOf("message");
        if (messageIndex !== -1) {
          keys.splice(messageIndex, 1);
        }
        if (keys.length === 1 && keys[0] === "required") {
          return validators.required;
        }
        return validators[this.getType(rule)] || void 0;
      };
      return Schema2;
    }();
    Schema.register = function register(type4, validator) {
      if (typeof validator !== "function") {
        throw new Error("Cannot register a validator by type, validator is not a function");
      }
      validators[type4] = validator;
    };
    Schema.warning = warning;
    Schema.messages = messages;
    Schema.validators = validators;
  }
});

// node_modules/@ctrl/tinycolor/dist/module/util.js
function bound01(n, max) {
  if (isOnePointZero(n)) {
    n = "100%";
  }
  var isPercent = isPercentage(n);
  n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
  if (isPercent) {
    n = parseInt(String(n * max), 10) / 100;
  }
  if (Math.abs(n - max) < 1e-6) {
    return 1;
  }
  if (max === 360) {
    n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
  } else {
    n = n % max / parseFloat(String(max));
  }
  return n;
}
function clamp01(val) {
  return Math.min(1, Math.max(0, val));
}
function isOnePointZero(n) {
  return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
}
function isPercentage(n) {
  return typeof n === "string" && n.indexOf("%") !== -1;
}
function boundAlpha(a2) {
  a2 = parseFloat(a2);
  if (isNaN(a2) || a2 < 0 || a2 > 1) {
    a2 = 1;
  }
  return a2;
}
function convertToPercentage(n) {
  if (n <= 1) {
    return "".concat(Number(n) * 100, "%");
  }
  return n;
}
function pad2(c2) {
  return c2.length === 1 ? "0" + c2 : String(c2);
}
var init_util = __esm({
  "node_modules/@ctrl/tinycolor/dist/module/util.js"() {
  }
});

// node_modules/@ctrl/tinycolor/dist/module/conversion.js
function rgbToRgb(r, g, b2) {
  return {
    r: bound01(r, 255) * 255,
    g: bound01(g, 255) * 255,
    b: bound01(b2, 255) * 255
  };
}
function rgbToHsl(r, g, b2) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b2 = bound01(b2, 255);
  var max = Math.max(r, g, b2);
  var min = Math.min(r, g, b2);
  var h2 = 0;
  var s2 = 0;
  var l2 = (max + min) / 2;
  if (max === min) {
    s2 = 0;
    h2 = 0;
  } else {
    var d2 = max - min;
    s2 = l2 > 0.5 ? d2 / (2 - max - min) : d2 / (max + min);
    switch (max) {
      case r:
        h2 = (g - b2) / d2 + (g < b2 ? 6 : 0);
        break;
      case g:
        h2 = (b2 - r) / d2 + 2;
        break;
      case b2:
        h2 = (r - g) / d2 + 4;
        break;
      default:
        break;
    }
    h2 /= 6;
  }
  return { h: h2, s: s2, l: l2 };
}
function hue2rgb(p2, q, t) {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p2 + (q - p2) * (6 * t);
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p2 + (q - p2) * (2 / 3 - t) * 6;
  }
  return p2;
}
function hslToRgb(h2, s2, l2) {
  var r;
  var g;
  var b2;
  h2 = bound01(h2, 360);
  s2 = bound01(s2, 100);
  l2 = bound01(l2, 100);
  if (s2 === 0) {
    g = l2;
    b2 = l2;
    r = l2;
  } else {
    var q = l2 < 0.5 ? l2 * (1 + s2) : l2 + s2 - l2 * s2;
    var p2 = 2 * l2 - q;
    r = hue2rgb(p2, q, h2 + 1 / 3);
    g = hue2rgb(p2, q, h2);
    b2 = hue2rgb(p2, q, h2 - 1 / 3);
  }
  return { r: r * 255, g: g * 255, b: b2 * 255 };
}
function rgbToHsv(r, g, b2) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b2 = bound01(b2, 255);
  var max = Math.max(r, g, b2);
  var min = Math.min(r, g, b2);
  var h2 = 0;
  var v2 = max;
  var d2 = max - min;
  var s2 = max === 0 ? 0 : d2 / max;
  if (max === min) {
    h2 = 0;
  } else {
    switch (max) {
      case r:
        h2 = (g - b2) / d2 + (g < b2 ? 6 : 0);
        break;
      case g:
        h2 = (b2 - r) / d2 + 2;
        break;
      case b2:
        h2 = (r - g) / d2 + 4;
        break;
      default:
        break;
    }
    h2 /= 6;
  }
  return { h: h2, s: s2, v: v2 };
}
function hsvToRgb(h2, s2, v2) {
  h2 = bound01(h2, 360) * 6;
  s2 = bound01(s2, 100);
  v2 = bound01(v2, 100);
  var i = Math.floor(h2);
  var f2 = h2 - i;
  var p2 = v2 * (1 - s2);
  var q = v2 * (1 - f2 * s2);
  var t = v2 * (1 - (1 - f2) * s2);
  var mod = i % 6;
  var r = [v2, q, p2, p2, t, v2][mod];
  var g = [t, v2, v2, q, p2, p2][mod];
  var b2 = [p2, p2, t, v2, v2, q][mod];
  return { r: r * 255, g: g * 255, b: b2 * 255 };
}
function rgbToHex(r, g, b2, allow3Char) {
  var hex2 = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b2).toString(16))
  ];
  if (allow3Char && hex2[0].startsWith(hex2[0].charAt(1)) && hex2[1].startsWith(hex2[1].charAt(1)) && hex2[2].startsWith(hex2[2].charAt(1))) {
    return hex2[0].charAt(0) + hex2[1].charAt(0) + hex2[2].charAt(0);
  }
  return hex2.join("");
}
function rgbaToHex(r, g, b2, a2, allow4Char) {
  var hex2 = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b2).toString(16)),
    pad2(convertDecimalToHex(a2))
  ];
  if (allow4Char && hex2[0].startsWith(hex2[0].charAt(1)) && hex2[1].startsWith(hex2[1].charAt(1)) && hex2[2].startsWith(hex2[2].charAt(1)) && hex2[3].startsWith(hex2[3].charAt(1))) {
    return hex2[0].charAt(0) + hex2[1].charAt(0) + hex2[2].charAt(0) + hex2[3].charAt(0);
  }
  return hex2.join("");
}
function rgbaToArgbHex(r, g, b2, a2) {
  var hex2 = [
    pad2(convertDecimalToHex(a2)),
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b2).toString(16))
  ];
  return hex2.join("");
}
function convertDecimalToHex(d2) {
  return Math.round(parseFloat(d2) * 255).toString(16);
}
function convertHexToDecimal(h2) {
  return parseIntFromHex(h2) / 255;
}
function parseIntFromHex(val) {
  return parseInt(val, 16);
}
function numberInputToObject(color) {
  return {
    r: color >> 16,
    g: (color & 65280) >> 8,
    b: color & 255
  };
}
var init_conversion = __esm({
  "node_modules/@ctrl/tinycolor/dist/module/conversion.js"() {
    init_util();
  }
});

// node_modules/@ctrl/tinycolor/dist/module/css-color-names.js
var names;
var init_css_color_names = __esm({
  "node_modules/@ctrl/tinycolor/dist/module/css-color-names.js"() {
    names = {
      aliceblue: "#f0f8ff",
      antiquewhite: "#faebd7",
      aqua: "#00ffff",
      aquamarine: "#7fffd4",
      azure: "#f0ffff",
      beige: "#f5f5dc",
      bisque: "#ffe4c4",
      black: "#000000",
      blanchedalmond: "#ffebcd",
      blue: "#0000ff",
      blueviolet: "#8a2be2",
      brown: "#a52a2a",
      burlywood: "#deb887",
      cadetblue: "#5f9ea0",
      chartreuse: "#7fff00",
      chocolate: "#d2691e",
      coral: "#ff7f50",
      cornflowerblue: "#6495ed",
      cornsilk: "#fff8dc",
      crimson: "#dc143c",
      cyan: "#00ffff",
      darkblue: "#00008b",
      darkcyan: "#008b8b",
      darkgoldenrod: "#b8860b",
      darkgray: "#a9a9a9",
      darkgreen: "#006400",
      darkgrey: "#a9a9a9",
      darkkhaki: "#bdb76b",
      darkmagenta: "#8b008b",
      darkolivegreen: "#556b2f",
      darkorange: "#ff8c00",
      darkorchid: "#9932cc",
      darkred: "#8b0000",
      darksalmon: "#e9967a",
      darkseagreen: "#8fbc8f",
      darkslateblue: "#483d8b",
      darkslategray: "#2f4f4f",
      darkslategrey: "#2f4f4f",
      darkturquoise: "#00ced1",
      darkviolet: "#9400d3",
      deeppink: "#ff1493",
      deepskyblue: "#00bfff",
      dimgray: "#696969",
      dimgrey: "#696969",
      dodgerblue: "#1e90ff",
      firebrick: "#b22222",
      floralwhite: "#fffaf0",
      forestgreen: "#228b22",
      fuchsia: "#ff00ff",
      gainsboro: "#dcdcdc",
      ghostwhite: "#f8f8ff",
      goldenrod: "#daa520",
      gold: "#ffd700",
      gray: "#808080",
      green: "#008000",
      greenyellow: "#adff2f",
      grey: "#808080",
      honeydew: "#f0fff0",
      hotpink: "#ff69b4",
      indianred: "#cd5c5c",
      indigo: "#4b0082",
      ivory: "#fffff0",
      khaki: "#f0e68c",
      lavenderblush: "#fff0f5",
      lavender: "#e6e6fa",
      lawngreen: "#7cfc00",
      lemonchiffon: "#fffacd",
      lightblue: "#add8e6",
      lightcoral: "#f08080",
      lightcyan: "#e0ffff",
      lightgoldenrodyellow: "#fafad2",
      lightgray: "#d3d3d3",
      lightgreen: "#90ee90",
      lightgrey: "#d3d3d3",
      lightpink: "#ffb6c1",
      lightsalmon: "#ffa07a",
      lightseagreen: "#20b2aa",
      lightskyblue: "#87cefa",
      lightslategray: "#778899",
      lightslategrey: "#778899",
      lightsteelblue: "#b0c4de",
      lightyellow: "#ffffe0",
      lime: "#00ff00",
      limegreen: "#32cd32",
      linen: "#faf0e6",
      magenta: "#ff00ff",
      maroon: "#800000",
      mediumaquamarine: "#66cdaa",
      mediumblue: "#0000cd",
      mediumorchid: "#ba55d3",
      mediumpurple: "#9370db",
      mediumseagreen: "#3cb371",
      mediumslateblue: "#7b68ee",
      mediumspringgreen: "#00fa9a",
      mediumturquoise: "#48d1cc",
      mediumvioletred: "#c71585",
      midnightblue: "#191970",
      mintcream: "#f5fffa",
      mistyrose: "#ffe4e1",
      moccasin: "#ffe4b5",
      navajowhite: "#ffdead",
      navy: "#000080",
      oldlace: "#fdf5e6",
      olive: "#808000",
      olivedrab: "#6b8e23",
      orange: "#ffa500",
      orangered: "#ff4500",
      orchid: "#da70d6",
      palegoldenrod: "#eee8aa",
      palegreen: "#98fb98",
      paleturquoise: "#afeeee",
      palevioletred: "#db7093",
      papayawhip: "#ffefd5",
      peachpuff: "#ffdab9",
      peru: "#cd853f",
      pink: "#ffc0cb",
      plum: "#dda0dd",
      powderblue: "#b0e0e6",
      purple: "#800080",
      rebeccapurple: "#663399",
      red: "#ff0000",
      rosybrown: "#bc8f8f",
      royalblue: "#4169e1",
      saddlebrown: "#8b4513",
      salmon: "#fa8072",
      sandybrown: "#f4a460",
      seagreen: "#2e8b57",
      seashell: "#fff5ee",
      sienna: "#a0522d",
      silver: "#c0c0c0",
      skyblue: "#87ceeb",
      slateblue: "#6a5acd",
      slategray: "#708090",
      slategrey: "#708090",
      snow: "#fffafa",
      springgreen: "#00ff7f",
      steelblue: "#4682b4",
      tan: "#d2b48c",
      teal: "#008080",
      thistle: "#d8bfd8",
      tomato: "#ff6347",
      turquoise: "#40e0d0",
      violet: "#ee82ee",
      wheat: "#f5deb3",
      white: "#ffffff",
      whitesmoke: "#f5f5f5",
      yellow: "#ffff00",
      yellowgreen: "#9acd32"
    };
  }
});

// node_modules/@ctrl/tinycolor/dist/module/format-input.js
function inputToRGB(color) {
  var rgb = { r: 0, g: 0, b: 0 };
  var a2 = 1;
  var s2 = null;
  var v2 = null;
  var l2 = null;
  var ok = false;
  var format2 = false;
  if (typeof color === "string") {
    color = stringInputToObject(color);
  }
  if (typeof color === "object") {
    if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
      rgb = rgbToRgb(color.r, color.g, color.b);
      ok = true;
      format2 = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
      s2 = convertToPercentage(color.s);
      v2 = convertToPercentage(color.v);
      rgb = hsvToRgb(color.h, s2, v2);
      ok = true;
      format2 = "hsv";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
      s2 = convertToPercentage(color.s);
      l2 = convertToPercentage(color.l);
      rgb = hslToRgb(color.h, s2, l2);
      ok = true;
      format2 = "hsl";
    }
    if (Object.prototype.hasOwnProperty.call(color, "a")) {
      a2 = color.a;
    }
  }
  a2 = boundAlpha(a2);
  return {
    ok,
    format: color.format || format2,
    r: Math.min(255, Math.max(rgb.r, 0)),
    g: Math.min(255, Math.max(rgb.g, 0)),
    b: Math.min(255, Math.max(rgb.b, 0)),
    a: a2
  };
}
function stringInputToObject(color) {
  color = color.trim().toLowerCase();
  if (color.length === 0) {
    return false;
  }
  var named = false;
  if (names[color]) {
    color = names[color];
    named = true;
  } else if (color === "transparent") {
    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
  }
  var match = matchers.rgb.exec(color);
  if (match) {
    return { r: match[1], g: match[2], b: match[3] };
  }
  match = matchers.rgba.exec(color);
  if (match) {
    return { r: match[1], g: match[2], b: match[3], a: match[4] };
  }
  match = matchers.hsl.exec(color);
  if (match) {
    return { h: match[1], s: match[2], l: match[3] };
  }
  match = matchers.hsla.exec(color);
  if (match) {
    return { h: match[1], s: match[2], l: match[3], a: match[4] };
  }
  match = matchers.hsv.exec(color);
  if (match) {
    return { h: match[1], s: match[2], v: match[3] };
  }
  match = matchers.hsva.exec(color);
  if (match) {
    return { h: match[1], s: match[2], v: match[3], a: match[4] };
  }
  match = matchers.hex8.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      a: convertHexToDecimal(match[4]),
      format: named ? "name" : "hex8"
    };
  }
  match = matchers.hex6.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      format: named ? "name" : "hex"
    };
  }
  match = matchers.hex4.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      a: convertHexToDecimal(match[4] + match[4]),
      format: named ? "name" : "hex8"
    };
  }
  match = matchers.hex3.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      format: named ? "name" : "hex"
    };
  }
  return false;
}
function isValidCSSUnit(color) {
  return Boolean(matchers.CSS_UNIT.exec(String(color)));
}
var CSS_INTEGER, CSS_NUMBER, CSS_UNIT, PERMISSIVE_MATCH3, PERMISSIVE_MATCH4, matchers;
var init_format_input = __esm({
  "node_modules/@ctrl/tinycolor/dist/module/format-input.js"() {
    init_conversion();
    init_css_color_names();
    init_util();
    CSS_INTEGER = "[-\\+]?\\d+%?";
    CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
    CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
    PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
    PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
    matchers = {
      CSS_UNIT: new RegExp(CSS_UNIT),
      rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
      rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
      hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
      hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
      hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
      hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
      hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
      hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
      hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
      hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
  }
});

// node_modules/@ctrl/tinycolor/dist/module/index.js
function tinycolor(color, opts) {
  if (color === void 0) {
    color = "";
  }
  if (opts === void 0) {
    opts = {};
  }
  return new TinyColor(color, opts);
}
var TinyColor;
var init_module = __esm({
  "node_modules/@ctrl/tinycolor/dist/module/index.js"() {
    init_conversion();
    init_css_color_names();
    init_format_input();
    init_util();
    TinyColor = function() {
      function TinyColor2(color, opts) {
        if (color === void 0) {
          color = "";
        }
        if (opts === void 0) {
          opts = {};
        }
        var _a;
        if (color instanceof TinyColor2) {
          return color;
        }
        if (typeof color === "number") {
          color = numberInputToObject(color);
        }
        this.originalInput = color;
        var rgb = inputToRGB(color);
        this.originalInput = color;
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        this.a = rgb.a;
        this.roundA = Math.round(100 * this.a) / 100;
        this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
        this.gradientType = opts.gradientType;
        if (this.r < 1) {
          this.r = Math.round(this.r);
        }
        if (this.g < 1) {
          this.g = Math.round(this.g);
        }
        if (this.b < 1) {
          this.b = Math.round(this.b);
        }
        this.isValid = rgb.ok;
      }
      TinyColor2.prototype.isDark = function() {
        return this.getBrightness() < 128;
      };
      TinyColor2.prototype.isLight = function() {
        return !this.isDark();
      };
      TinyColor2.prototype.getBrightness = function() {
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
      };
      TinyColor2.prototype.getLuminance = function() {
        var rgb = this.toRgb();
        var R;
        var G;
        var B;
        var RsRGB = rgb.r / 255;
        var GsRGB = rgb.g / 255;
        var BsRGB = rgb.b / 255;
        if (RsRGB <= 0.03928) {
          R = RsRGB / 12.92;
        } else {
          R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
        }
        if (GsRGB <= 0.03928) {
          G = GsRGB / 12.92;
        } else {
          G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
        }
        if (BsRGB <= 0.03928) {
          B = BsRGB / 12.92;
        } else {
          B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
        }
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
      };
      TinyColor2.prototype.getAlpha = function() {
        return this.a;
      };
      TinyColor2.prototype.setAlpha = function(alpha) {
        this.a = boundAlpha(alpha);
        this.roundA = Math.round(100 * this.a) / 100;
        return this;
      };
      TinyColor2.prototype.toHsv = function() {
        var hsv = rgbToHsv(this.r, this.g, this.b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
      };
      TinyColor2.prototype.toHsvString = function() {
        var hsv = rgbToHsv(this.r, this.g, this.b);
        var h2 = Math.round(hsv.h * 360);
        var s2 = Math.round(hsv.s * 100);
        var v2 = Math.round(hsv.v * 100);
        return this.a === 1 ? "hsv(".concat(h2, ", ").concat(s2, "%, ").concat(v2, "%)") : "hsva(".concat(h2, ", ").concat(s2, "%, ").concat(v2, "%, ").concat(this.roundA, ")");
      };
      TinyColor2.prototype.toHsl = function() {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
      };
      TinyColor2.prototype.toHslString = function() {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        var h2 = Math.round(hsl.h * 360);
        var s2 = Math.round(hsl.s * 100);
        var l2 = Math.round(hsl.l * 100);
        return this.a === 1 ? "hsl(".concat(h2, ", ").concat(s2, "%, ").concat(l2, "%)") : "hsla(".concat(h2, ", ").concat(s2, "%, ").concat(l2, "%, ").concat(this.roundA, ")");
      };
      TinyColor2.prototype.toHex = function(allow3Char) {
        if (allow3Char === void 0) {
          allow3Char = false;
        }
        return rgbToHex(this.r, this.g, this.b, allow3Char);
      };
      TinyColor2.prototype.toHexString = function(allow3Char) {
        if (allow3Char === void 0) {
          allow3Char = false;
        }
        return "#" + this.toHex(allow3Char);
      };
      TinyColor2.prototype.toHex8 = function(allow4Char) {
        if (allow4Char === void 0) {
          allow4Char = false;
        }
        return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
      };
      TinyColor2.prototype.toHex8String = function(allow4Char) {
        if (allow4Char === void 0) {
          allow4Char = false;
        }
        return "#" + this.toHex8(allow4Char);
      };
      TinyColor2.prototype.toRgb = function() {
        return {
          r: Math.round(this.r),
          g: Math.round(this.g),
          b: Math.round(this.b),
          a: this.a
        };
      };
      TinyColor2.prototype.toRgbString = function() {
        var r = Math.round(this.r);
        var g = Math.round(this.g);
        var b2 = Math.round(this.b);
        return this.a === 1 ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b2, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b2, ", ").concat(this.roundA, ")");
      };
      TinyColor2.prototype.toPercentageRgb = function() {
        var fmt = function(x2) {
          return "".concat(Math.round(bound01(x2, 255) * 100), "%");
        };
        return {
          r: fmt(this.r),
          g: fmt(this.g),
          b: fmt(this.b),
          a: this.a
        };
      };
      TinyColor2.prototype.toPercentageRgbString = function() {
        var rnd = function(x2) {
          return Math.round(bound01(x2, 255) * 100);
        };
        return this.a === 1 ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
      };
      TinyColor2.prototype.toName = function() {
        if (this.a === 0) {
          return "transparent";
        }
        if (this.a < 1) {
          return false;
        }
        var hex2 = "#" + rgbToHex(this.r, this.g, this.b, false);
        for (var _i = 0, _a = Object.entries(names); _i < _a.length; _i++) {
          var _b = _a[_i], key = _b[0], value = _b[1];
          if (hex2 === value) {
            return key;
          }
        }
        return false;
      };
      TinyColor2.prototype.toString = function(format2) {
        var formatSet = Boolean(format2);
        format2 = format2 !== null && format2 !== void 0 ? format2 : this.format;
        var formattedString = false;
        var hasAlpha = this.a < 1 && this.a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format2.startsWith("hex") || format2 === "name");
        if (needsAlphaFormat) {
          if (format2 === "name" && this.a === 0) {
            return this.toName();
          }
          return this.toRgbString();
        }
        if (format2 === "rgb") {
          formattedString = this.toRgbString();
        }
        if (format2 === "prgb") {
          formattedString = this.toPercentageRgbString();
        }
        if (format2 === "hex" || format2 === "hex6") {
          formattedString = this.toHexString();
        }
        if (format2 === "hex3") {
          formattedString = this.toHexString(true);
        }
        if (format2 === "hex4") {
          formattedString = this.toHex8String(true);
        }
        if (format2 === "hex8") {
          formattedString = this.toHex8String();
        }
        if (format2 === "name") {
          formattedString = this.toName();
        }
        if (format2 === "hsl") {
          formattedString = this.toHslString();
        }
        if (format2 === "hsv") {
          formattedString = this.toHsvString();
        }
        return formattedString || this.toHexString();
      };
      TinyColor2.prototype.toNumber = function() {
        return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
      };
      TinyColor2.prototype.clone = function() {
        return new TinyColor2(this.toString());
      };
      TinyColor2.prototype.lighten = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var hsl = this.toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.brighten = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var rgb = this.toRgb();
        rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
        rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
        rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
        return new TinyColor2(rgb);
      };
      TinyColor2.prototype.darken = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var hsl = this.toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.tint = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        return this.mix("white", amount);
      };
      TinyColor2.prototype.shade = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        return this.mix("black", amount);
      };
      TinyColor2.prototype.desaturate = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var hsl = this.toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.saturate = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var hsl = this.toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.greyscale = function() {
        return this.desaturate(100);
      };
      TinyColor2.prototype.spin = function(amount) {
        var hsl = this.toHsl();
        var hue = (hsl.h + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.mix = function(color, amount) {
        if (amount === void 0) {
          amount = 50;
        }
        var rgb1 = this.toRgb();
        var rgb2 = new TinyColor2(color).toRgb();
        var p2 = amount / 100;
        var rgba = {
          r: (rgb2.r - rgb1.r) * p2 + rgb1.r,
          g: (rgb2.g - rgb1.g) * p2 + rgb1.g,
          b: (rgb2.b - rgb1.b) * p2 + rgb1.b,
          a: (rgb2.a - rgb1.a) * p2 + rgb1.a
        };
        return new TinyColor2(rgba);
      };
      TinyColor2.prototype.analogous = function(results, slices) {
        if (results === void 0) {
          results = 6;
        }
        if (slices === void 0) {
          slices = 30;
        }
        var hsl = this.toHsl();
        var part = 360 / slices;
        var ret = [this];
        for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
          hsl.h = (hsl.h + part) % 360;
          ret.push(new TinyColor2(hsl));
        }
        return ret;
      };
      TinyColor2.prototype.complement = function() {
        var hsl = this.toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.monochromatic = function(results) {
        if (results === void 0) {
          results = 6;
        }
        var hsv = this.toHsv();
        var h2 = hsv.h;
        var s2 = hsv.s;
        var v2 = hsv.v;
        var res = [];
        var modification = 1 / results;
        while (results--) {
          res.push(new TinyColor2({ h: h2, s: s2, v: v2 }));
          v2 = (v2 + modification) % 1;
        }
        return res;
      };
      TinyColor2.prototype.splitcomplement = function() {
        var hsl = this.toHsl();
        var h2 = hsl.h;
        return [
          this,
          new TinyColor2({ h: (h2 + 72) % 360, s: hsl.s, l: hsl.l }),
          new TinyColor2({ h: (h2 + 216) % 360, s: hsl.s, l: hsl.l })
        ];
      };
      TinyColor2.prototype.onBackground = function(background) {
        var fg = this.toRgb();
        var bg = new TinyColor2(background).toRgb();
        return new TinyColor2({
          r: bg.r + (fg.r - bg.r) * fg.a,
          g: bg.g + (fg.g - bg.g) * fg.a,
          b: bg.b + (fg.b - bg.b) * fg.a
        });
      };
      TinyColor2.prototype.triad = function() {
        return this.polyad(3);
      };
      TinyColor2.prototype.tetrad = function() {
        return this.polyad(4);
      };
      TinyColor2.prototype.polyad = function(n) {
        var hsl = this.toHsl();
        var h2 = hsl.h;
        var result = [this];
        var increment = 360 / n;
        for (var i = 1; i < n; i++) {
          result.push(new TinyColor2({ h: (h2 + i * increment) % 360, s: hsl.s, l: hsl.l }));
        }
        return result;
      };
      TinyColor2.prototype.equals = function(color) {
        return this.toRgbString() === new TinyColor2(color).toRgbString();
      };
      return TinyColor2;
    }();
  }
});

// node_modules/@ctrl/tinycolor/dist/module/readability.js
function readability(color1, color2) {
  var c1 = new TinyColor(color1);
  var c2 = new TinyColor(color2);
  return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05);
}
function isReadable(color1, color2, wcag2) {
  var _a, _b;
  if (wcag2 === void 0) {
    wcag2 = { level: "AA", size: "small" };
  }
  var readabilityLevel = readability(color1, color2);
  switch (((_a = wcag2.level) !== null && _a !== void 0 ? _a : "AA") + ((_b = wcag2.size) !== null && _b !== void 0 ? _b : "small")) {
    case "AAsmall":
    case "AAAlarge":
      return readabilityLevel >= 4.5;
    case "AAlarge":
      return readabilityLevel >= 3;
    case "AAAsmall":
      return readabilityLevel >= 7;
    default:
      return false;
  }
}
function mostReadable(baseColor, colorList, args) {
  if (args === void 0) {
    args = { includeFallbackColors: false, level: "AA", size: "small" };
  }
  var bestColor = null;
  var bestScore = 0;
  var includeFallbackColors = args.includeFallbackColors, level = args.level, size = args.size;
  for (var _i = 0, colorList_1 = colorList; _i < colorList_1.length; _i++) {
    var color = colorList_1[_i];
    var score = readability(baseColor, color);
    if (score > bestScore) {
      bestScore = score;
      bestColor = new TinyColor(color);
    }
  }
  if (isReadable(baseColor, bestColor, { level, size }) || !includeFallbackColors) {
    return bestColor;
  }
  args.includeFallbackColors = false;
  return mostReadable(baseColor, ["#fff", "#000"], args);
}
var init_readability = __esm({
  "node_modules/@ctrl/tinycolor/dist/module/readability.js"() {
    init_module();
  }
});

// node_modules/@ctrl/tinycolor/dist/module/to-ms-filter.js
function toMsFilter(firstColor, secondColor) {
  var color = new TinyColor(firstColor);
  var hex8String = "#" + rgbaToArgbHex(color.r, color.g, color.b, color.a);
  var secondHex8String = hex8String;
  var gradientType = color.gradientType ? "GradientType = 1, " : "";
  if (secondColor) {
    var s2 = new TinyColor(secondColor);
    secondHex8String = "#" + rgbaToArgbHex(s2.r, s2.g, s2.b, s2.a);
  }
  return "progid:DXImageTransform.Microsoft.gradient(".concat(gradientType, "startColorstr=").concat(hex8String, ",endColorstr=").concat(secondHex8String, ")");
}
var init_to_ms_filter = __esm({
  "node_modules/@ctrl/tinycolor/dist/module/to-ms-filter.js"() {
    init_conversion();
    init_module();
  }
});

// node_modules/@ctrl/tinycolor/dist/module/from-ratio.js
function fromRatio(ratio, opts) {
  var newColor = {
    r: convertToPercentage(ratio.r),
    g: convertToPercentage(ratio.g),
    b: convertToPercentage(ratio.b)
  };
  if (ratio.a !== void 0) {
    newColor.a = Number(ratio.a);
  }
  return new TinyColor(newColor, opts);
}
function legacyRandom() {
  return new TinyColor({
    r: Math.random(),
    g: Math.random(),
    b: Math.random()
  });
}
var init_from_ratio = __esm({
  "node_modules/@ctrl/tinycolor/dist/module/from-ratio.js"() {
    init_module();
    init_util();
  }
});

// node_modules/@ctrl/tinycolor/dist/module/random.js
function random(options) {
  if (options === void 0) {
    options = {};
  }
  if (options.count !== void 0 && options.count !== null) {
    var totalColors = options.count;
    var colors = [];
    options.count = void 0;
    while (totalColors > colors.length) {
      options.count = null;
      if (options.seed) {
        options.seed += 1;
      }
      colors.push(random(options));
    }
    options.count = totalColors;
    return colors;
  }
  var h2 = pickHue(options.hue, options.seed);
  var s2 = pickSaturation(h2, options);
  var v2 = pickBrightness(h2, s2, options);
  var res = { h: h2, s: s2, v: v2 };
  if (options.alpha !== void 0) {
    res.a = options.alpha;
  }
  return new TinyColor(res);
}
function pickHue(hue, seed) {
  var hueRange = getHueRange(hue);
  var res = randomWithin(hueRange, seed);
  if (res < 0) {
    res = 360 + res;
  }
  return res;
}
function pickSaturation(hue, options) {
  if (options.hue === "monochrome") {
    return 0;
  }
  if (options.luminosity === "random") {
    return randomWithin([0, 100], options.seed);
  }
  var saturationRange = getColorInfo(hue).saturationRange;
  var sMin = saturationRange[0];
  var sMax = saturationRange[1];
  switch (options.luminosity) {
    case "bright":
      sMin = 55;
      break;
    case "dark":
      sMin = sMax - 10;
      break;
    case "light":
      sMax = 55;
      break;
    default:
      break;
  }
  return randomWithin([sMin, sMax], options.seed);
}
function pickBrightness(H, S2, options) {
  var bMin = getMinimumBrightness(H, S2);
  var bMax = 100;
  switch (options.luminosity) {
    case "dark":
      bMax = bMin + 20;
      break;
    case "light":
      bMin = (bMax + bMin) / 2;
      break;
    case "random":
      bMin = 0;
      bMax = 100;
      break;
    default:
      break;
  }
  return randomWithin([bMin, bMax], options.seed);
}
function getMinimumBrightness(H, S2) {
  var lowerBounds = getColorInfo(H).lowerBounds;
  for (var i = 0; i < lowerBounds.length - 1; i++) {
    var s1 = lowerBounds[i][0];
    var v1 = lowerBounds[i][1];
    var s2 = lowerBounds[i + 1][0];
    var v2 = lowerBounds[i + 1][1];
    if (S2 >= s1 && S2 <= s2) {
      var m2 = (v2 - v1) / (s2 - s1);
      var b2 = v1 - m2 * s1;
      return m2 * S2 + b2;
    }
  }
  return 0;
}
function getHueRange(colorInput) {
  var num = parseInt(colorInput, 10);
  if (!Number.isNaN(num) && num < 360 && num > 0) {
    return [num, num];
  }
  if (typeof colorInput === "string") {
    var namedColor = bounds.find(function(n) {
      return n.name === colorInput;
    });
    if (namedColor) {
      var color = defineColor(namedColor);
      if (color.hueRange) {
        return color.hueRange;
      }
    }
    var parsed = new TinyColor(colorInput);
    if (parsed.isValid) {
      var hue = parsed.toHsv().h;
      return [hue, hue];
    }
  }
  return [0, 360];
}
function getColorInfo(hue) {
  if (hue >= 334 && hue <= 360) {
    hue -= 360;
  }
  for (var _i = 0, bounds_1 = bounds; _i < bounds_1.length; _i++) {
    var bound = bounds_1[_i];
    var color = defineColor(bound);
    if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) {
      return color;
    }
  }
  throw Error("Color not found");
}
function randomWithin(range3, seed) {
  if (seed === void 0) {
    return Math.floor(range3[0] + Math.random() * (range3[1] + 1 - range3[0]));
  }
  var max = range3[1] || 1;
  var min = range3[0] || 0;
  seed = (seed * 9301 + 49297) % 233280;
  var rnd = seed / 233280;
  return Math.floor(min + rnd * (max - min));
}
function defineColor(bound) {
  var sMin = bound.lowerBounds[0][0];
  var sMax = bound.lowerBounds[bound.lowerBounds.length - 1][0];
  var bMin = bound.lowerBounds[bound.lowerBounds.length - 1][1];
  var bMax = bound.lowerBounds[0][1];
  return {
    name: bound.name,
    hueRange: bound.hueRange,
    lowerBounds: bound.lowerBounds,
    saturationRange: [sMin, sMax],
    brightnessRange: [bMin, bMax]
  };
}
var bounds;
var init_random = __esm({
  "node_modules/@ctrl/tinycolor/dist/module/random.js"() {
    init_module();
    bounds = [
      {
        name: "monochrome",
        hueRange: null,
        lowerBounds: [
          [0, 0],
          [100, 0]
        ]
      },
      {
        name: "red",
        hueRange: [-26, 18],
        lowerBounds: [
          [20, 100],
          [30, 92],
          [40, 89],
          [50, 85],
          [60, 78],
          [70, 70],
          [80, 60],
          [90, 55],
          [100, 50]
        ]
      },
      {
        name: "orange",
        hueRange: [19, 46],
        lowerBounds: [
          [20, 100],
          [30, 93],
          [40, 88],
          [50, 86],
          [60, 85],
          [70, 70],
          [100, 70]
        ]
      },
      {
        name: "yellow",
        hueRange: [47, 62],
        lowerBounds: [
          [25, 100],
          [40, 94],
          [50, 89],
          [60, 86],
          [70, 84],
          [80, 82],
          [90, 80],
          [100, 75]
        ]
      },
      {
        name: "green",
        hueRange: [63, 178],
        lowerBounds: [
          [30, 100],
          [40, 90],
          [50, 85],
          [60, 81],
          [70, 74],
          [80, 64],
          [90, 50],
          [100, 40]
        ]
      },
      {
        name: "blue",
        hueRange: [179, 257],
        lowerBounds: [
          [20, 100],
          [30, 86],
          [40, 80],
          [50, 74],
          [60, 60],
          [70, 52],
          [80, 44],
          [90, 39],
          [100, 35]
        ]
      },
      {
        name: "purple",
        hueRange: [258, 282],
        lowerBounds: [
          [20, 100],
          [30, 87],
          [40, 79],
          [50, 70],
          [60, 65],
          [70, 59],
          [80, 52],
          [90, 45],
          [100, 42]
        ]
      },
      {
        name: "pink",
        hueRange: [283, 334],
        lowerBounds: [
          [20, 100],
          [30, 90],
          [40, 86],
          [60, 84],
          [80, 80],
          [90, 75],
          [100, 73]
        ]
      }
    ];
  }
});

// node_modules/@ctrl/tinycolor/dist/module/interfaces.js
var init_interfaces = __esm({
  "node_modules/@ctrl/tinycolor/dist/module/interfaces.js"() {
  }
});

// node_modules/@ctrl/tinycolor/dist/module/public_api.js
var public_api_exports = {};
__export(public_api_exports, {
  TinyColor: () => TinyColor,
  bounds: () => bounds,
  convertDecimalToHex: () => convertDecimalToHex,
  convertHexToDecimal: () => convertHexToDecimal,
  default: () => public_api_default,
  fromRatio: () => fromRatio,
  hslToRgb: () => hslToRgb,
  hsvToRgb: () => hsvToRgb,
  inputToRGB: () => inputToRGB,
  isReadable: () => isReadable,
  isValidCSSUnit: () => isValidCSSUnit,
  legacyRandom: () => legacyRandom,
  mostReadable: () => mostReadable,
  names: () => names,
  numberInputToObject: () => numberInputToObject,
  parseIntFromHex: () => parseIntFromHex,
  random: () => random,
  readability: () => readability,
  rgbToHex: () => rgbToHex,
  rgbToHsl: () => rgbToHsl,
  rgbToHsv: () => rgbToHsv,
  rgbToRgb: () => rgbToRgb,
  rgbaToArgbHex: () => rgbaToArgbHex,
  rgbaToHex: () => rgbaToHex,
  stringInputToObject: () => stringInputToObject,
  tinycolor: () => tinycolor,
  toMsFilter: () => toMsFilter
});
var public_api_default;
var init_public_api = __esm({
  "node_modules/@ctrl/tinycolor/dist/module/public_api.js"() {
    init_module();
    init_module();
    init_css_color_names();
    init_readability();
    init_to_ms_filter();
    init_from_ratio();
    init_format_input();
    init_random();
    init_interfaces();
    init_conversion();
    public_api_default = tinycolor;
  }
});

// node_modules/memoize-one/dist/memoize-one.esm.js
var memoize_one_esm_exports = {};
__export(memoize_one_esm_exports, {
  default: () => memoizeOne
});
function isEqual(first, second) {
  if (first === second) {
    return true;
  }
  if (safeIsNaN(first) && safeIsNaN(second)) {
    return true;
  }
  return false;
}
function areInputsEqual(newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  for (var i = 0; i < newInputs.length; i++) {
    if (!isEqual(newInputs[i], lastInputs[i])) {
      return false;
    }
  }
  return true;
}
function memoizeOne(resultFn, isEqual2) {
  if (isEqual2 === void 0) {
    isEqual2 = areInputsEqual;
  }
  var cache = null;
  function memoized() {
    var newArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      newArgs[_i] = arguments[_i];
    }
    if (cache && cache.lastThis === this && isEqual2(newArgs, cache.lastArgs)) {
      return cache.lastResult;
    }
    var lastResult = resultFn.apply(this, newArgs);
    cache = {
      lastResult,
      lastArgs: newArgs,
      lastThis: this
    };
    return lastResult;
  }
  memoized.clear = function clear() {
    cache = null;
  };
  return memoized;
}
var safeIsNaN;
var init_memoize_one_esm = __esm({
  "node_modules/memoize-one/dist/memoize-one.esm.js"() {
    safeIsNaN = Number.isNaN || function ponyfill(value) {
      return typeof value === "number" && value !== value;
    };
  }
});

// node_modules/escape-html/index.js
var require_escape_html = __commonJS({
  "node_modules/escape-html/index.js"(exports, module) {
    "use strict";
    var matchHtmlRegExp = /["'&<>]/;
    module.exports = escapeHtml;
    function escapeHtml(string3) {
      var str = "" + string3;
      var match = matchHtmlRegExp.exec(str);
      if (!match) {
        return str;
      }
      var escape;
      var html = "";
      var index = 0;
      var lastIndex = 0;
      for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
          case 34:
            escape = "&quot;";
            break;
          case 38:
            escape = "&amp;";
            break;
          case 39:
            escape = "&#39;";
            break;
          case 60:
            escape = "&lt;";
            break;
          case 62:
            escape = "&gt;";
            break;
          default:
            continue;
        }
        if (lastIndex !== index) {
          html += str.substring(lastIndex, index);
        }
        lastIndex = index + 1;
        html += escape;
      }
      return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
    }
  }
});

export {
  TinyColor,
  public_api_exports,
  init_public_api,
  require_localeData,
  require_customParseFormat,
  Y,
  dist_exports,
  init_dist,
  require_advancedFormat,
  require_weekOfYear,
  require_weekYear,
  require_dayOfYear,
  require_isSameOrAfter,
  require_isSameOrBefore,
  Schema,
  dist_web_exports,
  init_dist_web,
  memoizeOne,
  memoize_one_esm_exports,
  init_memoize_one_esm,
  require_escape_html
};
/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */
/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
//# sourceMappingURL=chunk-CQF3H5FS.js.map
