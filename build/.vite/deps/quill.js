import {
  __commonJS
} from "./chunk-QOVRSCHT.js";

// node_modules/quill/dist/quill.js
var require_quill = __commonJS({
  "node_modules/quill/dist/quill.js"(exports, module) {
    (function webpackUniversalModuleDefinition(root, factory) {
      if (typeof exports === "object" && typeof module === "object")
        module.exports = factory();
      else if (typeof define === "function" && define.amd)
        define([], factory);
      else if (typeof exports === "object")
        exports["Quill"] = factory();
      else
        root["Quill"] = factory();
    })(typeof self !== "undefined" ? self : exports, function() {
      return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
          if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
          }
          var module2 = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
          };
          modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
          module2.l = true;
          return module2.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function(exports2, name, getter) {
          if (!__webpack_require__.o(exports2, name)) {
            Object.defineProperty(exports2, name, {
              configurable: false,
              enumerable: true,
              get: getter
            });
          }
        };
        __webpack_require__.n = function(module2) {
          var getter = module2 && module2.__esModule ? function getDefault() {
            return module2["default"];
          } : function getModuleExports() {
            return module2;
          };
          __webpack_require__.d(getter, "a", getter);
          return getter;
        };
        __webpack_require__.o = function(object, property) {
          return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = 109);
      }([
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", { value: true });
          var container_1 = __webpack_require__(17);
          var format_1 = __webpack_require__(18);
          var leaf_1 = __webpack_require__(19);
          var scroll_1 = __webpack_require__(45);
          var inline_1 = __webpack_require__(46);
          var block_1 = __webpack_require__(47);
          var embed_1 = __webpack_require__(48);
          var text_1 = __webpack_require__(49);
          var attributor_1 = __webpack_require__(12);
          var class_1 = __webpack_require__(32);
          var style_1 = __webpack_require__(33);
          var store_1 = __webpack_require__(31);
          var Registry = __webpack_require__(1);
          var Parchment = {
            Scope: Registry.Scope,
            create: Registry.create,
            find: Registry.find,
            query: Registry.query,
            register: Registry.register,
            Container: container_1.default,
            Format: format_1.default,
            Leaf: leaf_1.default,
            Embed: embed_1.default,
            Scroll: scroll_1.default,
            Block: block_1.default,
            Inline: inline_1.default,
            Text: text_1.default,
            Attributor: {
              Attribute: attributor_1.default,
              Class: class_1.default,
              Style: style_1.default,
              Store: store_1.default
            }
          };
          exports2.default = Parchment;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
              d.__proto__ = b;
            } || function(d, b) {
              for (var p in b)
                if (b.hasOwnProperty(p))
                  d[p] = b[p];
            };
            return function(d, b) {
              extendStatics(d, b);
              function __() {
                this.constructor = d;
              }
              d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
          }();
          Object.defineProperty(exports2, "__esModule", { value: true });
          var ParchmentError = function(_super) {
            __extends(ParchmentError2, _super);
            function ParchmentError2(message) {
              var _this = this;
              message = "[Parchment] " + message;
              _this = _super.call(this, message) || this;
              _this.message = message;
              _this.name = _this.constructor.name;
              return _this;
            }
            return ParchmentError2;
          }(Error);
          exports2.ParchmentError = ParchmentError;
          var attributes = {};
          var classes = {};
          var tags = {};
          var types = {};
          exports2.DATA_KEY = "__blot";
          var Scope;
          (function(Scope2) {
            Scope2[Scope2["TYPE"] = 3] = "TYPE";
            Scope2[Scope2["LEVEL"] = 12] = "LEVEL";
            Scope2[Scope2["ATTRIBUTE"] = 13] = "ATTRIBUTE";
            Scope2[Scope2["BLOT"] = 14] = "BLOT";
            Scope2[Scope2["INLINE"] = 7] = "INLINE";
            Scope2[Scope2["BLOCK"] = 11] = "BLOCK";
            Scope2[Scope2["BLOCK_BLOT"] = 10] = "BLOCK_BLOT";
            Scope2[Scope2["INLINE_BLOT"] = 6] = "INLINE_BLOT";
            Scope2[Scope2["BLOCK_ATTRIBUTE"] = 9] = "BLOCK_ATTRIBUTE";
            Scope2[Scope2["INLINE_ATTRIBUTE"] = 5] = "INLINE_ATTRIBUTE";
            Scope2[Scope2["ANY"] = 15] = "ANY";
          })(Scope = exports2.Scope || (exports2.Scope = {}));
          function create(input, value) {
            var match = query(input);
            if (match == null) {
              throw new ParchmentError("Unable to create " + input + " blot");
            }
            var BlotClass = match;
            var node = input instanceof Node || input["nodeType"] === Node.TEXT_NODE ? input : BlotClass.create(value);
            return new BlotClass(node, value);
          }
          exports2.create = create;
          function find(node, bubble) {
            if (bubble === void 0) {
              bubble = false;
            }
            if (node == null)
              return null;
            if (node[exports2.DATA_KEY] != null)
              return node[exports2.DATA_KEY].blot;
            if (bubble)
              return find(node.parentNode, bubble);
            return null;
          }
          exports2.find = find;
          function query(query2, scope) {
            if (scope === void 0) {
              scope = Scope.ANY;
            }
            var match;
            if (typeof query2 === "string") {
              match = types[query2] || attributes[query2];
            } else if (query2 instanceof Text || query2["nodeType"] === Node.TEXT_NODE) {
              match = types["text"];
            } else if (typeof query2 === "number") {
              if (query2 & Scope.LEVEL & Scope.BLOCK) {
                match = types["block"];
              } else if (query2 & Scope.LEVEL & Scope.INLINE) {
                match = types["inline"];
              }
            } else if (query2 instanceof HTMLElement) {
              var names = (query2.getAttribute("class") || "").split(/\s+/);
              for (var i in names) {
                match = classes[names[i]];
                if (match)
                  break;
              }
              match = match || tags[query2.tagName];
            }
            if (match == null)
              return null;
            if (scope & Scope.LEVEL & match.scope && scope & Scope.TYPE & match.scope)
              return match;
            return null;
          }
          exports2.query = query;
          function register() {
            var Definitions = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              Definitions[_i] = arguments[_i];
            }
            if (Definitions.length > 1) {
              return Definitions.map(function(d) {
                return register(d);
              });
            }
            var Definition = Definitions[0];
            if (typeof Definition.blotName !== "string" && typeof Definition.attrName !== "string") {
              throw new ParchmentError("Invalid definition");
            } else if (Definition.blotName === "abstract") {
              throw new ParchmentError("Cannot register abstract class");
            }
            types[Definition.blotName || Definition.attrName] = Definition;
            if (typeof Definition.keyName === "string") {
              attributes[Definition.keyName] = Definition;
            } else {
              if (Definition.className != null) {
                classes[Definition.className] = Definition;
              }
              if (Definition.tagName != null) {
                if (Array.isArray(Definition.tagName)) {
                  Definition.tagName = Definition.tagName.map(function(tagName) {
                    return tagName.toUpperCase();
                  });
                } else {
                  Definition.tagName = Definition.tagName.toUpperCase();
                }
                var tagNames = Array.isArray(Definition.tagName) ? Definition.tagName : [Definition.tagName];
                tagNames.forEach(function(tag) {
                  if (tags[tag] == null || Definition.className == null) {
                    tags[tag] = Definition;
                  }
                });
              }
            }
            return Definition;
          }
          exports2.register = register;
        },
        function(module2, exports2, __webpack_require__) {
          var diff = __webpack_require__(51);
          var equal = __webpack_require__(11);
          var extend = __webpack_require__(3);
          var op = __webpack_require__(20);
          var NULL_CHARACTER = String.fromCharCode(0);
          var Delta = function(ops) {
            if (Array.isArray(ops)) {
              this.ops = ops;
            } else if (ops != null && Array.isArray(ops.ops)) {
              this.ops = ops.ops;
            } else {
              this.ops = [];
            }
          };
          Delta.prototype.insert = function(text, attributes) {
            var newOp = {};
            if (text.length === 0)
              return this;
            newOp.insert = text;
            if (attributes != null && typeof attributes === "object" && Object.keys(attributes).length > 0) {
              newOp.attributes = attributes;
            }
            return this.push(newOp);
          };
          Delta.prototype["delete"] = function(length) {
            if (length <= 0)
              return this;
            return this.push({ "delete": length });
          };
          Delta.prototype.retain = function(length, attributes) {
            if (length <= 0)
              return this;
            var newOp = { retain: length };
            if (attributes != null && typeof attributes === "object" && Object.keys(attributes).length > 0) {
              newOp.attributes = attributes;
            }
            return this.push(newOp);
          };
          Delta.prototype.push = function(newOp) {
            var index = this.ops.length;
            var lastOp = this.ops[index - 1];
            newOp = extend(true, {}, newOp);
            if (typeof lastOp === "object") {
              if (typeof newOp["delete"] === "number" && typeof lastOp["delete"] === "number") {
                this.ops[index - 1] = { "delete": lastOp["delete"] + newOp["delete"] };
                return this;
              }
              if (typeof lastOp["delete"] === "number" && newOp.insert != null) {
                index -= 1;
                lastOp = this.ops[index - 1];
                if (typeof lastOp !== "object") {
                  this.ops.unshift(newOp);
                  return this;
                }
              }
              if (equal(newOp.attributes, lastOp.attributes)) {
                if (typeof newOp.insert === "string" && typeof lastOp.insert === "string") {
                  this.ops[index - 1] = { insert: lastOp.insert + newOp.insert };
                  if (typeof newOp.attributes === "object")
                    this.ops[index - 1].attributes = newOp.attributes;
                  return this;
                } else if (typeof newOp.retain === "number" && typeof lastOp.retain === "number") {
                  this.ops[index - 1] = { retain: lastOp.retain + newOp.retain };
                  if (typeof newOp.attributes === "object")
                    this.ops[index - 1].attributes = newOp.attributes;
                  return this;
                }
              }
            }
            if (index === this.ops.length) {
              this.ops.push(newOp);
            } else {
              this.ops.splice(index, 0, newOp);
            }
            return this;
          };
          Delta.prototype.chop = function() {
            var lastOp = this.ops[this.ops.length - 1];
            if (lastOp && lastOp.retain && !lastOp.attributes) {
              this.ops.pop();
            }
            return this;
          };
          Delta.prototype.filter = function(predicate) {
            return this.ops.filter(predicate);
          };
          Delta.prototype.forEach = function(predicate) {
            this.ops.forEach(predicate);
          };
          Delta.prototype.map = function(predicate) {
            return this.ops.map(predicate);
          };
          Delta.prototype.partition = function(predicate) {
            var passed = [], failed = [];
            this.forEach(function(op2) {
              var target = predicate(op2) ? passed : failed;
              target.push(op2);
            });
            return [passed, failed];
          };
          Delta.prototype.reduce = function(predicate, initial) {
            return this.ops.reduce(predicate, initial);
          };
          Delta.prototype.changeLength = function() {
            return this.reduce(function(length, elem) {
              if (elem.insert) {
                return length + op.length(elem);
              } else if (elem.delete) {
                return length - elem.delete;
              }
              return length;
            }, 0);
          };
          Delta.prototype.length = function() {
            return this.reduce(function(length, elem) {
              return length + op.length(elem);
            }, 0);
          };
          Delta.prototype.slice = function(start, end) {
            start = start || 0;
            if (typeof end !== "number")
              end = Infinity;
            var ops = [];
            var iter = op.iterator(this.ops);
            var index = 0;
            while (index < end && iter.hasNext()) {
              var nextOp;
              if (index < start) {
                nextOp = iter.next(start - index);
              } else {
                nextOp = iter.next(end - index);
                ops.push(nextOp);
              }
              index += op.length(nextOp);
            }
            return new Delta(ops);
          };
          Delta.prototype.compose = function(other) {
            var thisIter = op.iterator(this.ops);
            var otherIter = op.iterator(other.ops);
            var ops = [];
            var firstOther = otherIter.peek();
            if (firstOther != null && typeof firstOther.retain === "number" && firstOther.attributes == null) {
              var firstLeft = firstOther.retain;
              while (thisIter.peekType() === "insert" && thisIter.peekLength() <= firstLeft) {
                firstLeft -= thisIter.peekLength();
                ops.push(thisIter.next());
              }
              if (firstOther.retain - firstLeft > 0) {
                otherIter.next(firstOther.retain - firstLeft);
              }
            }
            var delta = new Delta(ops);
            while (thisIter.hasNext() || otherIter.hasNext()) {
              if (otherIter.peekType() === "insert") {
                delta.push(otherIter.next());
              } else if (thisIter.peekType() === "delete") {
                delta.push(thisIter.next());
              } else {
                var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
                var thisOp = thisIter.next(length);
                var otherOp = otherIter.next(length);
                if (typeof otherOp.retain === "number") {
                  var newOp = {};
                  if (typeof thisOp.retain === "number") {
                    newOp.retain = length;
                  } else {
                    newOp.insert = thisOp.insert;
                  }
                  var attributes = op.attributes.compose(thisOp.attributes, otherOp.attributes, typeof thisOp.retain === "number");
                  if (attributes)
                    newOp.attributes = attributes;
                  delta.push(newOp);
                  if (!otherIter.hasNext() && equal(delta.ops[delta.ops.length - 1], newOp)) {
                    var rest = new Delta(thisIter.rest());
                    return delta.concat(rest).chop();
                  }
                } else if (typeof otherOp["delete"] === "number" && typeof thisOp.retain === "number") {
                  delta.push(otherOp);
                }
              }
            }
            return delta.chop();
          };
          Delta.prototype.concat = function(other) {
            var delta = new Delta(this.ops.slice());
            if (other.ops.length > 0) {
              delta.push(other.ops[0]);
              delta.ops = delta.ops.concat(other.ops.slice(1));
            }
            return delta;
          };
          Delta.prototype.diff = function(other, index) {
            if (this.ops === other.ops) {
              return new Delta();
            }
            var strings = [this, other].map(function(delta2) {
              return delta2.map(function(op2) {
                if (op2.insert != null) {
                  return typeof op2.insert === "string" ? op2.insert : NULL_CHARACTER;
                }
                var prep = delta2 === other ? "on" : "with";
                throw new Error("diff() called " + prep + " non-document");
              }).join("");
            });
            var delta = new Delta();
            var diffResult = diff(strings[0], strings[1], index);
            var thisIter = op.iterator(this.ops);
            var otherIter = op.iterator(other.ops);
            diffResult.forEach(function(component) {
              var length = component[1].length;
              while (length > 0) {
                var opLength = 0;
                switch (component[0]) {
                  case diff.INSERT:
                    opLength = Math.min(otherIter.peekLength(), length);
                    delta.push(otherIter.next(opLength));
                    break;
                  case diff.DELETE:
                    opLength = Math.min(length, thisIter.peekLength());
                    thisIter.next(opLength);
                    delta["delete"](opLength);
                    break;
                  case diff.EQUAL:
                    opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length);
                    var thisOp = thisIter.next(opLength);
                    var otherOp = otherIter.next(opLength);
                    if (equal(thisOp.insert, otherOp.insert)) {
                      delta.retain(opLength, op.attributes.diff(thisOp.attributes, otherOp.attributes));
                    } else {
                      delta.push(otherOp)["delete"](opLength);
                    }
                    break;
                }
                length -= opLength;
              }
            });
            return delta.chop();
          };
          Delta.prototype.eachLine = function(predicate, newline) {
            newline = newline || "\n";
            var iter = op.iterator(this.ops);
            var line = new Delta();
            var i = 0;
            while (iter.hasNext()) {
              if (iter.peekType() !== "insert")
                return;
              var thisOp = iter.peek();
              var start = op.length(thisOp) - iter.peekLength();
              var index = typeof thisOp.insert === "string" ? thisOp.insert.indexOf(newline, start) - start : -1;
              if (index < 0) {
                line.push(iter.next());
              } else if (index > 0) {
                line.push(iter.next(index));
              } else {
                if (predicate(line, iter.next(1).attributes || {}, i) === false) {
                  return;
                }
                i += 1;
                line = new Delta();
              }
            }
            if (line.length() > 0) {
              predicate(line, {}, i);
            }
          };
          Delta.prototype.transform = function(other, priority) {
            priority = !!priority;
            if (typeof other === "number") {
              return this.transformPosition(other, priority);
            }
            var thisIter = op.iterator(this.ops);
            var otherIter = op.iterator(other.ops);
            var delta = new Delta();
            while (thisIter.hasNext() || otherIter.hasNext()) {
              if (thisIter.peekType() === "insert" && (priority || otherIter.peekType() !== "insert")) {
                delta.retain(op.length(thisIter.next()));
              } else if (otherIter.peekType() === "insert") {
                delta.push(otherIter.next());
              } else {
                var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
                var thisOp = thisIter.next(length);
                var otherOp = otherIter.next(length);
                if (thisOp["delete"]) {
                  continue;
                } else if (otherOp["delete"]) {
                  delta.push(otherOp);
                } else {
                  delta.retain(length, op.attributes.transform(thisOp.attributes, otherOp.attributes, priority));
                }
              }
            }
            return delta.chop();
          };
          Delta.prototype.transformPosition = function(index, priority) {
            priority = !!priority;
            var thisIter = op.iterator(this.ops);
            var offset = 0;
            while (thisIter.hasNext() && offset <= index) {
              var length = thisIter.peekLength();
              var nextType = thisIter.peekType();
              thisIter.next();
              if (nextType === "delete") {
                index -= Math.min(length, index - offset);
                continue;
              } else if (nextType === "insert" && (offset < index || !priority)) {
                index += length;
              }
              offset += length;
            }
            return index;
          };
          module2.exports = Delta;
        },
        function(module2, exports2) {
          "use strict";
          var hasOwn = Object.prototype.hasOwnProperty;
          var toStr = Object.prototype.toString;
          var defineProperty = Object.defineProperty;
          var gOPD = Object.getOwnPropertyDescriptor;
          var isArray = function isArray2(arr) {
            if (typeof Array.isArray === "function") {
              return Array.isArray(arr);
            }
            return toStr.call(arr) === "[object Array]";
          };
          var isPlainObject = function isPlainObject2(obj) {
            if (!obj || toStr.call(obj) !== "[object Object]") {
              return false;
            }
            var hasOwnConstructor = hasOwn.call(obj, "constructor");
            var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
            if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
              return false;
            }
            var key;
            for (key in obj) {
            }
            return typeof key === "undefined" || hasOwn.call(obj, key);
          };
          var setProperty = function setProperty2(target, options) {
            if (defineProperty && options.name === "__proto__") {
              defineProperty(target, options.name, {
                enumerable: true,
                configurable: true,
                value: options.newValue,
                writable: true
              });
            } else {
              target[options.name] = options.newValue;
            }
          };
          var getProperty = function getProperty2(obj, name) {
            if (name === "__proto__") {
              if (!hasOwn.call(obj, name)) {
                return void 0;
              } else if (gOPD) {
                return gOPD(obj, name).value;
              }
            }
            return obj[name];
          };
          module2.exports = function extend() {
            var options, name, src, copy, copyIsArray, clone;
            var target = arguments[0];
            var i = 1;
            var length = arguments.length;
            var deep = false;
            if (typeof target === "boolean") {
              deep = target;
              target = arguments[1] || {};
              i = 2;
            }
            if (target == null || typeof target !== "object" && typeof target !== "function") {
              target = {};
            }
            for (; i < length; ++i) {
              options = arguments[i];
              if (options != null) {
                for (name in options) {
                  src = getProperty(target, name);
                  copy = getProperty(options, name);
                  if (target !== copy) {
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                      if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && isArray(src) ? src : [];
                      } else {
                        clone = src && isPlainObject(src) ? src : {};
                      }
                      setProperty(target, { name, newValue: extend(deep, clone, copy) });
                    } else if (typeof copy !== "undefined") {
                      setProperty(target, { name, newValue: copy });
                    }
                  }
                }
              }
            }
            return target;
          };
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.default = exports2.BlockEmbed = exports2.bubbleFormats = void 0;
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _extend = __webpack_require__(3);
          var _extend2 = _interopRequireDefault(_extend);
          var _quillDelta = __webpack_require__(2);
          var _quillDelta2 = _interopRequireDefault(_quillDelta);
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _break = __webpack_require__(16);
          var _break2 = _interopRequireDefault(_break);
          var _inline = __webpack_require__(6);
          var _inline2 = _interopRequireDefault(_inline);
          var _text = __webpack_require__(7);
          var _text2 = _interopRequireDefault(_text);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var NEWLINE_LENGTH = 1;
          var BlockEmbed = function(_Parchment$Embed) {
            _inherits(BlockEmbed2, _Parchment$Embed);
            function BlockEmbed2() {
              _classCallCheck(this, BlockEmbed2);
              return _possibleConstructorReturn(this, (BlockEmbed2.__proto__ || Object.getPrototypeOf(BlockEmbed2)).apply(this, arguments));
            }
            _createClass(BlockEmbed2, [{
              key: "attach",
              value: function attach() {
                _get(BlockEmbed2.prototype.__proto__ || Object.getPrototypeOf(BlockEmbed2.prototype), "attach", this).call(this);
                this.attributes = new _parchment2.default.Attributor.Store(this.domNode);
              }
            }, {
              key: "delta",
              value: function delta() {
                return new _quillDelta2.default().insert(this.value(), (0, _extend2.default)(this.formats(), this.attributes.values()));
              }
            }, {
              key: "format",
              value: function format(name, value) {
                var attribute = _parchment2.default.query(name, _parchment2.default.Scope.BLOCK_ATTRIBUTE);
                if (attribute != null) {
                  this.attributes.attribute(attribute, value);
                }
              }
            }, {
              key: "formatAt",
              value: function formatAt(index, length, name, value) {
                this.format(name, value);
              }
            }, {
              key: "insertAt",
              value: function insertAt(index, value, def) {
                if (typeof value === "string" && value.endsWith("\n")) {
                  var block = _parchment2.default.create(Block.blotName);
                  this.parent.insertBefore(block, index === 0 ? this : this.next);
                  block.insertAt(0, value.slice(0, -1));
                } else {
                  _get(BlockEmbed2.prototype.__proto__ || Object.getPrototypeOf(BlockEmbed2.prototype), "insertAt", this).call(this, index, value, def);
                }
              }
            }]);
            return BlockEmbed2;
          }(_parchment2.default.Embed);
          BlockEmbed.scope = _parchment2.default.Scope.BLOCK_BLOT;
          var Block = function(_Parchment$Block) {
            _inherits(Block2, _Parchment$Block);
            function Block2(domNode) {
              _classCallCheck(this, Block2);
              var _this2 = _possibleConstructorReturn(this, (Block2.__proto__ || Object.getPrototypeOf(Block2)).call(this, domNode));
              _this2.cache = {};
              return _this2;
            }
            _createClass(Block2, [{
              key: "delta",
              value: function delta() {
                if (this.cache.delta == null) {
                  this.cache.delta = this.descendants(_parchment2.default.Leaf).reduce(function(delta2, leaf) {
                    if (leaf.length() === 0) {
                      return delta2;
                    } else {
                      return delta2.insert(leaf.value(), bubbleFormats(leaf));
                    }
                  }, new _quillDelta2.default()).insert("\n", bubbleFormats(this));
                }
                return this.cache.delta;
              }
            }, {
              key: "deleteAt",
              value: function deleteAt(index, length) {
                _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "deleteAt", this).call(this, index, length);
                this.cache = {};
              }
            }, {
              key: "formatAt",
              value: function formatAt(index, length, name, value) {
                if (length <= 0)
                  return;
                if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK)) {
                  if (index + length === this.length()) {
                    this.format(name, value);
                  }
                } else {
                  _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "formatAt", this).call(this, index, Math.min(length, this.length() - index - 1), name, value);
                }
                this.cache = {};
              }
            }, {
              key: "insertAt",
              value: function insertAt(index, value, def) {
                if (def != null)
                  return _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "insertAt", this).call(this, index, value, def);
                if (value.length === 0)
                  return;
                var lines = value.split("\n");
                var text = lines.shift();
                if (text.length > 0) {
                  if (index < this.length() - 1 || this.children.tail == null) {
                    _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "insertAt", this).call(this, Math.min(index, this.length() - 1), text);
                  } else {
                    this.children.tail.insertAt(this.children.tail.length(), text);
                  }
                  this.cache = {};
                }
                var block = this;
                lines.reduce(function(index2, line) {
                  block = block.split(index2, true);
                  block.insertAt(0, line);
                  return line.length;
                }, index + text.length);
              }
            }, {
              key: "insertBefore",
              value: function insertBefore(blot, ref) {
                var head = this.children.head;
                _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "insertBefore", this).call(this, blot, ref);
                if (head instanceof _break2.default) {
                  head.remove();
                }
                this.cache = {};
              }
            }, {
              key: "length",
              value: function length() {
                if (this.cache.length == null) {
                  this.cache.length = _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "length", this).call(this) + NEWLINE_LENGTH;
                }
                return this.cache.length;
              }
            }, {
              key: "moveChildren",
              value: function moveChildren(target, ref) {
                _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "moveChildren", this).call(this, target, ref);
                this.cache = {};
              }
            }, {
              key: "optimize",
              value: function optimize(context) {
                _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "optimize", this).call(this, context);
                this.cache = {};
              }
            }, {
              key: "path",
              value: function path(index) {
                return _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "path", this).call(this, index, true);
              }
            }, {
              key: "removeChild",
              value: function removeChild(child) {
                _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "removeChild", this).call(this, child);
                this.cache = {};
              }
            }, {
              key: "split",
              value: function split(index) {
                var force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
                  var clone = this.clone();
                  if (index === 0) {
                    this.parent.insertBefore(clone, this);
                    return this;
                  } else {
                    this.parent.insertBefore(clone, this.next);
                    return clone;
                  }
                } else {
                  var next = _get(Block2.prototype.__proto__ || Object.getPrototypeOf(Block2.prototype), "split", this).call(this, index, force);
                  this.cache = {};
                  return next;
                }
              }
            }]);
            return Block2;
          }(_parchment2.default.Block);
          Block.blotName = "block";
          Block.tagName = "P";
          Block.defaultChild = "break";
          Block.allowedChildren = [_inline2.default, _parchment2.default.Embed, _text2.default];
          function bubbleFormats(blot) {
            var formats = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            if (blot == null)
              return formats;
            if (typeof blot.formats === "function") {
              formats = (0, _extend2.default)(formats, blot.formats());
            }
            if (blot.parent == null || blot.parent.blotName == "scroll" || blot.parent.statics.scope !== blot.statics.scope) {
              return formats;
            }
            return bubbleFormats(blot.parent, formats);
          }
          exports2.bubbleFormats = bubbleFormats;
          exports2.BlockEmbed = BlockEmbed;
          exports2.default = Block;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.default = exports2.overload = exports2.expandConfig = void 0;
          var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
          } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
          var _slicedToArray = function() {
            function sliceIterator(arr, i) {
              var _arr = [];
              var _n = true;
              var _d = false;
              var _e = void 0;
              try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                  _arr.push(_s.value);
                  if (i && _arr.length === i)
                    break;
                }
              } catch (err) {
                _d = true;
                _e = err;
              } finally {
                try {
                  if (!_n && _i["return"])
                    _i["return"]();
                } finally {
                  if (_d)
                    throw _e;
                }
              }
              return _arr;
            }
            return function(arr, i) {
              if (Array.isArray(arr)) {
                return arr;
              } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
              } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
              }
            };
          }();
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          __webpack_require__(50);
          var _quillDelta = __webpack_require__(2);
          var _quillDelta2 = _interopRequireDefault(_quillDelta);
          var _editor = __webpack_require__(14);
          var _editor2 = _interopRequireDefault(_editor);
          var _emitter3 = __webpack_require__(8);
          var _emitter4 = _interopRequireDefault(_emitter3);
          var _module = __webpack_require__(9);
          var _module2 = _interopRequireDefault(_module);
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _selection = __webpack_require__(15);
          var _selection2 = _interopRequireDefault(_selection);
          var _extend = __webpack_require__(3);
          var _extend2 = _interopRequireDefault(_extend);
          var _logger = __webpack_require__(10);
          var _logger2 = _interopRequireDefault(_logger);
          var _theme = __webpack_require__(34);
          var _theme2 = _interopRequireDefault(_theme);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _defineProperty(obj, key, value) {
            if (key in obj) {
              Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
            } else {
              obj[key] = value;
            }
            return obj;
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          var debug = (0, _logger2.default)("quill");
          var Quill = function() {
            _createClass(Quill2, null, [{
              key: "debug",
              value: function debug2(limit) {
                if (limit === true) {
                  limit = "log";
                }
                _logger2.default.level(limit);
              }
            }, {
              key: "find",
              value: function find(node) {
                return node.__quill || _parchment2.default.find(node);
              }
            }, {
              key: "import",
              value: function _import(name) {
                if (this.imports[name] == null) {
                  debug.error("Cannot import " + name + ". Are you sure it was registered?");
                }
                return this.imports[name];
              }
            }, {
              key: "register",
              value: function register(path, target) {
                var _this = this;
                var overwrite = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
                if (typeof path !== "string") {
                  var name = path.attrName || path.blotName;
                  if (typeof name === "string") {
                    this.register("formats/" + name, path, target);
                  } else {
                    Object.keys(path).forEach(function(key) {
                      _this.register(key, path[key], target);
                    });
                  }
                } else {
                  if (this.imports[path] != null && !overwrite) {
                    debug.warn("Overwriting " + path + " with", target);
                  }
                  this.imports[path] = target;
                  if ((path.startsWith("blots/") || path.startsWith("formats/")) && target.blotName !== "abstract") {
                    _parchment2.default.register(target);
                  } else if (path.startsWith("modules") && typeof target.register === "function") {
                    target.register();
                  }
                }
              }
            }]);
            function Quill2(container) {
              var _this2 = this;
              var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              _classCallCheck(this, Quill2);
              this.options = expandConfig(container, options);
              this.container = this.options.container;
              if (this.container == null) {
                return debug.error("Invalid Quill container", container);
              }
              if (this.options.debug) {
                Quill2.debug(this.options.debug);
              }
              var html = this.container.innerHTML.trim();
              this.container.classList.add("ql-container");
              this.container.innerHTML = "";
              this.container.__quill = this;
              this.root = this.addContainer("ql-editor");
              this.root.classList.add("ql-blank");
              this.root.setAttribute("data-gramm", false);
              this.scrollingContainer = this.options.scrollingContainer || this.root;
              this.emitter = new _emitter4.default();
              this.scroll = _parchment2.default.create(this.root, {
                emitter: this.emitter,
                whitelist: this.options.formats
              });
              this.editor = new _editor2.default(this.scroll);
              this.selection = new _selection2.default(this.scroll, this.emitter);
              this.theme = new this.options.theme(this, this.options);
              this.keyboard = this.theme.addModule("keyboard");
              this.clipboard = this.theme.addModule("clipboard");
              this.history = this.theme.addModule("history");
              this.theme.init();
              this.emitter.on(_emitter4.default.events.EDITOR_CHANGE, function(type) {
                if (type === _emitter4.default.events.TEXT_CHANGE) {
                  _this2.root.classList.toggle("ql-blank", _this2.editor.isBlank());
                }
              });
              this.emitter.on(_emitter4.default.events.SCROLL_UPDATE, function(source, mutations) {
                var range = _this2.selection.lastRange;
                var index = range && range.length === 0 ? range.index : void 0;
                modify.call(_this2, function() {
                  return _this2.editor.update(null, mutations, index);
                }, source);
              });
              var contents = this.clipboard.convert(`<div class='ql-editor' style="white-space: normal;">` + html + "<p><br></p></div>");
              this.setContents(contents);
              this.history.clear();
              if (this.options.placeholder) {
                this.root.setAttribute("data-placeholder", this.options.placeholder);
              }
              if (this.options.readOnly) {
                this.disable();
              }
            }
            _createClass(Quill2, [{
              key: "addContainer",
              value: function addContainer(container) {
                var refNode = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
                if (typeof container === "string") {
                  var className = container;
                  container = document.createElement("div");
                  container.classList.add(className);
                }
                this.container.insertBefore(container, refNode);
                return container;
              }
            }, {
              key: "blur",
              value: function blur() {
                this.selection.setRange(null);
              }
            }, {
              key: "deleteText",
              value: function deleteText(index, length, source) {
                var _this3 = this;
                var _overload = overload(index, length, source);
                var _overload2 = _slicedToArray(_overload, 4);
                index = _overload2[0];
                length = _overload2[1];
                source = _overload2[3];
                return modify.call(this, function() {
                  return _this3.editor.deleteText(index, length);
                }, source, index, -1 * length);
              }
            }, {
              key: "disable",
              value: function disable() {
                this.enable(false);
              }
            }, {
              key: "enable",
              value: function enable() {
                var enabled = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
                this.scroll.enable(enabled);
                this.container.classList.toggle("ql-disabled", !enabled);
              }
            }, {
              key: "focus",
              value: function focus() {
                var scrollTop = this.scrollingContainer.scrollTop;
                this.selection.focus();
                this.scrollingContainer.scrollTop = scrollTop;
                this.scrollIntoView();
              }
            }, {
              key: "format",
              value: function format(name, value) {
                var _this4 = this;
                var source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _emitter4.default.sources.API;
                return modify.call(this, function() {
                  var range = _this4.getSelection(true);
                  var change = new _quillDelta2.default();
                  if (range == null) {
                    return change;
                  } else if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK)) {
                    change = _this4.editor.formatLine(range.index, range.length, _defineProperty({}, name, value));
                  } else if (range.length === 0) {
                    _this4.selection.format(name, value);
                    return change;
                  } else {
                    change = _this4.editor.formatText(range.index, range.length, _defineProperty({}, name, value));
                  }
                  _this4.setSelection(range, _emitter4.default.sources.SILENT);
                  return change;
                }, source);
              }
            }, {
              key: "formatLine",
              value: function formatLine(index, length, name, value, source) {
                var _this5 = this;
                var formats = void 0;
                var _overload3 = overload(index, length, name, value, source);
                var _overload4 = _slicedToArray(_overload3, 4);
                index = _overload4[0];
                length = _overload4[1];
                formats = _overload4[2];
                source = _overload4[3];
                return modify.call(this, function() {
                  return _this5.editor.formatLine(index, length, formats);
                }, source, index, 0);
              }
            }, {
              key: "formatText",
              value: function formatText(index, length, name, value, source) {
                var _this6 = this;
                var formats = void 0;
                var _overload5 = overload(index, length, name, value, source);
                var _overload6 = _slicedToArray(_overload5, 4);
                index = _overload6[0];
                length = _overload6[1];
                formats = _overload6[2];
                source = _overload6[3];
                return modify.call(this, function() {
                  return _this6.editor.formatText(index, length, formats);
                }, source, index, 0);
              }
            }, {
              key: "getBounds",
              value: function getBounds(index) {
                var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
                var bounds = void 0;
                if (typeof index === "number") {
                  bounds = this.selection.getBounds(index, length);
                } else {
                  bounds = this.selection.getBounds(index.index, index.length);
                }
                var containerBounds = this.container.getBoundingClientRect();
                return {
                  bottom: bounds.bottom - containerBounds.top,
                  height: bounds.height,
                  left: bounds.left - containerBounds.left,
                  right: bounds.right - containerBounds.left,
                  top: bounds.top - containerBounds.top,
                  width: bounds.width
                };
              }
            }, {
              key: "getContents",
              value: function getContents() {
                var index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
                var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.getLength() - index;
                var _overload7 = overload(index, length);
                var _overload8 = _slicedToArray(_overload7, 2);
                index = _overload8[0];
                length = _overload8[1];
                return this.editor.getContents(index, length);
              }
            }, {
              key: "getFormat",
              value: function getFormat() {
                var index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.getSelection(true);
                var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
                if (typeof index === "number") {
                  return this.editor.getFormat(index, length);
                } else {
                  return this.editor.getFormat(index.index, index.length);
                }
              }
            }, {
              key: "getIndex",
              value: function getIndex(blot) {
                return blot.offset(this.scroll);
              }
            }, {
              key: "getLength",
              value: function getLength() {
                return this.scroll.length();
              }
            }, {
              key: "getLeaf",
              value: function getLeaf(index) {
                return this.scroll.leaf(index);
              }
            }, {
              key: "getLine",
              value: function getLine(index) {
                return this.scroll.line(index);
              }
            }, {
              key: "getLines",
              value: function getLines() {
                var index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
                var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
                if (typeof index !== "number") {
                  return this.scroll.lines(index.index, index.length);
                } else {
                  return this.scroll.lines(index, length);
                }
              }
            }, {
              key: "getModule",
              value: function getModule(name) {
                return this.theme.modules[name];
              }
            }, {
              key: "getSelection",
              value: function getSelection() {
                var focus = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                if (focus)
                  this.focus();
                this.update();
                return this.selection.getRange()[0];
              }
            }, {
              key: "getText",
              value: function getText() {
                var index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
                var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.getLength() - index;
                var _overload9 = overload(index, length);
                var _overload10 = _slicedToArray(_overload9, 2);
                index = _overload10[0];
                length = _overload10[1];
                return this.editor.getText(index, length);
              }
            }, {
              key: "hasFocus",
              value: function hasFocus() {
                return this.selection.hasFocus();
              }
            }, {
              key: "insertEmbed",
              value: function insertEmbed(index, embed, value) {
                var _this7 = this;
                var source = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : Quill2.sources.API;
                return modify.call(this, function() {
                  return _this7.editor.insertEmbed(index, embed, value);
                }, source, index);
              }
            }, {
              key: "insertText",
              value: function insertText(index, text, name, value, source) {
                var _this8 = this;
                var formats = void 0;
                var _overload11 = overload(index, 0, name, value, source);
                var _overload12 = _slicedToArray(_overload11, 4);
                index = _overload12[0];
                formats = _overload12[2];
                source = _overload12[3];
                return modify.call(this, function() {
                  return _this8.editor.insertText(index, text, formats);
                }, source, index, text.length);
              }
            }, {
              key: "isEnabled",
              value: function isEnabled() {
                return !this.container.classList.contains("ql-disabled");
              }
            }, {
              key: "off",
              value: function off() {
                return this.emitter.off.apply(this.emitter, arguments);
              }
            }, {
              key: "on",
              value: function on() {
                return this.emitter.on.apply(this.emitter, arguments);
              }
            }, {
              key: "once",
              value: function once() {
                return this.emitter.once.apply(this.emitter, arguments);
              }
            }, {
              key: "pasteHTML",
              value: function pasteHTML(index, html, source) {
                this.clipboard.dangerouslyPasteHTML(index, html, source);
              }
            }, {
              key: "removeFormat",
              value: function removeFormat(index, length, source) {
                var _this9 = this;
                var _overload13 = overload(index, length, source);
                var _overload14 = _slicedToArray(_overload13, 4);
                index = _overload14[0];
                length = _overload14[1];
                source = _overload14[3];
                return modify.call(this, function() {
                  return _this9.editor.removeFormat(index, length);
                }, source, index);
              }
            }, {
              key: "scrollIntoView",
              value: function scrollIntoView() {
                this.selection.scrollIntoView(this.scrollingContainer);
              }
            }, {
              key: "setContents",
              value: function setContents(delta) {
                var _this10 = this;
                var source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _emitter4.default.sources.API;
                return modify.call(this, function() {
                  delta = new _quillDelta2.default(delta);
                  var length = _this10.getLength();
                  var deleted = _this10.editor.deleteText(0, length);
                  var applied = _this10.editor.applyDelta(delta);
                  var lastOp = applied.ops[applied.ops.length - 1];
                  if (lastOp != null && typeof lastOp.insert === "string" && lastOp.insert[lastOp.insert.length - 1] === "\n") {
                    _this10.editor.deleteText(_this10.getLength() - 1, 1);
                    applied.delete(1);
                  }
                  var ret = deleted.compose(applied);
                  return ret;
                }, source);
              }
            }, {
              key: "setSelection",
              value: function setSelection(index, length, source) {
                if (index == null) {
                  this.selection.setRange(null, length || Quill2.sources.API);
                } else {
                  var _overload15 = overload(index, length, source);
                  var _overload16 = _slicedToArray(_overload15, 4);
                  index = _overload16[0];
                  length = _overload16[1];
                  source = _overload16[3];
                  this.selection.setRange(new _selection.Range(index, length), source);
                  if (source !== _emitter4.default.sources.SILENT) {
                    this.selection.scrollIntoView(this.scrollingContainer);
                  }
                }
              }
            }, {
              key: "setText",
              value: function setText(text) {
                var source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _emitter4.default.sources.API;
                var delta = new _quillDelta2.default().insert(text);
                return this.setContents(delta, source);
              }
            }, {
              key: "update",
              value: function update() {
                var source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _emitter4.default.sources.USER;
                var change = this.scroll.update(source);
                this.selection.update(source);
                return change;
              }
            }, {
              key: "updateContents",
              value: function updateContents(delta) {
                var _this11 = this;
                var source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _emitter4.default.sources.API;
                return modify.call(this, function() {
                  delta = new _quillDelta2.default(delta);
                  return _this11.editor.applyDelta(delta, source);
                }, source, true);
              }
            }]);
            return Quill2;
          }();
          Quill.DEFAULTS = {
            bounds: null,
            formats: null,
            modules: {},
            placeholder: "",
            readOnly: false,
            scrollingContainer: null,
            strict: true,
            theme: "default"
          };
          Quill.events = _emitter4.default.events;
          Quill.sources = _emitter4.default.sources;
          Quill.version = false ? "dev" : "1.3.7";
          Quill.imports = {
            "delta": _quillDelta2.default,
            "parchment": _parchment2.default,
            "core/module": _module2.default,
            "core/theme": _theme2.default
          };
          function expandConfig(container, userConfig) {
            userConfig = (0, _extend2.default)(true, {
              container,
              modules: {
                clipboard: true,
                keyboard: true,
                history: true
              }
            }, userConfig);
            if (!userConfig.theme || userConfig.theme === Quill.DEFAULTS.theme) {
              userConfig.theme = _theme2.default;
            } else {
              userConfig.theme = Quill.import("themes/" + userConfig.theme);
              if (userConfig.theme == null) {
                throw new Error("Invalid theme " + userConfig.theme + ". Did you register it?");
              }
            }
            var themeConfig = (0, _extend2.default)(true, {}, userConfig.theme.DEFAULTS);
            [themeConfig, userConfig].forEach(function(config) {
              config.modules = config.modules || {};
              Object.keys(config.modules).forEach(function(module3) {
                if (config.modules[module3] === true) {
                  config.modules[module3] = {};
                }
              });
            });
            var moduleNames = Object.keys(themeConfig.modules).concat(Object.keys(userConfig.modules));
            var moduleConfig = moduleNames.reduce(function(config, name) {
              var moduleClass = Quill.import("modules/" + name);
              if (moduleClass == null) {
                debug.error("Cannot load " + name + " module. Are you sure you registered it?");
              } else {
                config[name] = moduleClass.DEFAULTS || {};
              }
              return config;
            }, {});
            if (userConfig.modules != null && userConfig.modules.toolbar && userConfig.modules.toolbar.constructor !== Object) {
              userConfig.modules.toolbar = {
                container: userConfig.modules.toolbar
              };
            }
            userConfig = (0, _extend2.default)(true, {}, Quill.DEFAULTS, { modules: moduleConfig }, themeConfig, userConfig);
            ["bounds", "container", "scrollingContainer"].forEach(function(key) {
              if (typeof userConfig[key] === "string") {
                userConfig[key] = document.querySelector(userConfig[key]);
              }
            });
            userConfig.modules = Object.keys(userConfig.modules).reduce(function(config, name) {
              if (userConfig.modules[name]) {
                config[name] = userConfig.modules[name];
              }
              return config;
            }, {});
            return userConfig;
          }
          function modify(modifier, source, index, shift) {
            if (this.options.strict && !this.isEnabled() && source === _emitter4.default.sources.USER) {
              return new _quillDelta2.default();
            }
            var range = index == null ? null : this.getSelection();
            var oldDelta = this.editor.delta;
            var change = modifier();
            if (range != null) {
              if (index === true)
                index = range.index;
              if (shift == null) {
                range = shiftRange(range, change, source);
              } else if (shift !== 0) {
                range = shiftRange(range, index, shift, source);
              }
              this.setSelection(range, _emitter4.default.sources.SILENT);
            }
            if (change.length() > 0) {
              var _emitter;
              var args = [_emitter4.default.events.TEXT_CHANGE, change, oldDelta, source];
              (_emitter = this.emitter).emit.apply(_emitter, [_emitter4.default.events.EDITOR_CHANGE].concat(args));
              if (source !== _emitter4.default.sources.SILENT) {
                var _emitter2;
                (_emitter2 = this.emitter).emit.apply(_emitter2, args);
              }
            }
            return change;
          }
          function overload(index, length, name, value, source) {
            var formats = {};
            if (typeof index.index === "number" && typeof index.length === "number") {
              if (typeof length !== "number") {
                source = value, value = name, name = length, length = index.length, index = index.index;
              } else {
                length = index.length, index = index.index;
              }
            } else if (typeof length !== "number") {
              source = value, value = name, name = length, length = 0;
            }
            if ((typeof name === "undefined" ? "undefined" : _typeof(name)) === "object") {
              formats = name;
              source = value;
            } else if (typeof name === "string") {
              if (value != null) {
                formats[name] = value;
              } else {
                source = name;
              }
            }
            source = source || _emitter4.default.sources.API;
            return [index, length, formats, source];
          }
          function shiftRange(range, index, length, source) {
            if (range == null)
              return null;
            var start = void 0, end = void 0;
            if (index instanceof _quillDelta2.default) {
              var _map = [range.index, range.index + range.length].map(function(pos) {
                return index.transformPosition(pos, source !== _emitter4.default.sources.USER);
              });
              var _map2 = _slicedToArray(_map, 2);
              start = _map2[0];
              end = _map2[1];
            } else {
              var _map3 = [range.index, range.index + range.length].map(function(pos) {
                if (pos < index || pos === index && source === _emitter4.default.sources.USER)
                  return pos;
                if (length >= 0) {
                  return pos + length;
                } else {
                  return Math.max(index, pos + length);
                }
              });
              var _map4 = _slicedToArray(_map3, 2);
              start = _map4[0];
              end = _map4[1];
            }
            return new _selection.Range(start, end - start);
          }
          exports2.expandConfig = expandConfig;
          exports2.overload = overload;
          exports2.default = Quill;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _text = __webpack_require__(7);
          var _text2 = _interopRequireDefault(_text);
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var Inline = function(_Parchment$Inline) {
            _inherits(Inline2, _Parchment$Inline);
            function Inline2() {
              _classCallCheck(this, Inline2);
              return _possibleConstructorReturn(this, (Inline2.__proto__ || Object.getPrototypeOf(Inline2)).apply(this, arguments));
            }
            _createClass(Inline2, [{
              key: "formatAt",
              value: function formatAt(index, length, name, value) {
                if (Inline2.compare(this.statics.blotName, name) < 0 && _parchment2.default.query(name, _parchment2.default.Scope.BLOT)) {
                  var blot = this.isolate(index, length);
                  if (value) {
                    blot.wrap(name, value);
                  }
                } else {
                  _get(Inline2.prototype.__proto__ || Object.getPrototypeOf(Inline2.prototype), "formatAt", this).call(this, index, length, name, value);
                }
              }
            }, {
              key: "optimize",
              value: function optimize(context) {
                _get(Inline2.prototype.__proto__ || Object.getPrototypeOf(Inline2.prototype), "optimize", this).call(this, context);
                if (this.parent instanceof Inline2 && Inline2.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
                  var parent = this.parent.isolate(this.offset(), this.length());
                  this.moveChildren(parent);
                  parent.wrap(this);
                }
              }
            }], [{
              key: "compare",
              value: function compare(self2, other) {
                var selfIndex = Inline2.order.indexOf(self2);
                var otherIndex = Inline2.order.indexOf(other);
                if (selfIndex >= 0 || otherIndex >= 0) {
                  return selfIndex - otherIndex;
                } else if (self2 === other) {
                  return 0;
                } else if (self2 < other) {
                  return -1;
                } else {
                  return 1;
                }
              }
            }]);
            return Inline2;
          }(_parchment2.default.Inline);
          Inline.allowedChildren = [Inline, _parchment2.default.Embed, _text2.default];
          Inline.order = [
            "cursor",
            "inline",
            "underline",
            "strike",
            "italic",
            "bold",
            "script",
            "link",
            "code"
          ];
          exports2.default = Inline;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var TextBlot = function(_Parchment$Text) {
            _inherits(TextBlot2, _Parchment$Text);
            function TextBlot2() {
              _classCallCheck(this, TextBlot2);
              return _possibleConstructorReturn(this, (TextBlot2.__proto__ || Object.getPrototypeOf(TextBlot2)).apply(this, arguments));
            }
            return TextBlot2;
          }(_parchment2.default.Text);
          exports2.default = TextBlot;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _eventemitter = __webpack_require__(54);
          var _eventemitter2 = _interopRequireDefault(_eventemitter);
          var _logger = __webpack_require__(10);
          var _logger2 = _interopRequireDefault(_logger);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var debug = (0, _logger2.default)("quill:events");
          var EVENTS = ["selectionchange", "mousedown", "mouseup", "click"];
          EVENTS.forEach(function(eventName) {
            document.addEventListener(eventName, function() {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              [].slice.call(document.querySelectorAll(".ql-container")).forEach(function(node) {
                if (node.__quill && node.__quill.emitter) {
                  var _node$__quill$emitter;
                  (_node$__quill$emitter = node.__quill.emitter).handleDOM.apply(_node$__quill$emitter, args);
                }
              });
            });
          });
          var Emitter = function(_EventEmitter) {
            _inherits(Emitter2, _EventEmitter);
            function Emitter2() {
              _classCallCheck(this, Emitter2);
              var _this = _possibleConstructorReturn(this, (Emitter2.__proto__ || Object.getPrototypeOf(Emitter2)).call(this));
              _this.listeners = {};
              _this.on("error", debug.error);
              return _this;
            }
            _createClass(Emitter2, [{
              key: "emit",
              value: function emit() {
                debug.log.apply(debug, arguments);
                _get(Emitter2.prototype.__proto__ || Object.getPrototypeOf(Emitter2.prototype), "emit", this).apply(this, arguments);
              }
            }, {
              key: "handleDOM",
              value: function handleDOM(event) {
                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                  args[_key2 - 1] = arguments[_key2];
                }
                (this.listeners[event.type] || []).forEach(function(_ref) {
                  var node = _ref.node, handler = _ref.handler;
                  if (event.target === node || node.contains(event.target)) {
                    handler.apply(void 0, [event].concat(args));
                  }
                });
              }
            }, {
              key: "listenDOM",
              value: function listenDOM(eventName, node, handler) {
                if (!this.listeners[eventName]) {
                  this.listeners[eventName] = [];
                }
                this.listeners[eventName].push({ node, handler });
              }
            }]);
            return Emitter2;
          }(_eventemitter2.default);
          Emitter.events = {
            EDITOR_CHANGE: "editor-change",
            SCROLL_BEFORE_UPDATE: "scroll-before-update",
            SCROLL_OPTIMIZE: "scroll-optimize",
            SCROLL_UPDATE: "scroll-update",
            SELECTION_CHANGE: "selection-change",
            TEXT_CHANGE: "text-change"
          };
          Emitter.sources = {
            API: "api",
            SILENT: "silent",
            USER: "user"
          };
          exports2.default = Emitter;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          var Module = function Module2(quill) {
            var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            _classCallCheck(this, Module2);
            this.quill = quill;
            this.options = options;
          };
          Module.DEFAULTS = {};
          exports2.default = Module;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var levels = ["error", "warn", "log", "info"];
          var level = "warn";
          function debug(method) {
            if (levels.indexOf(method) <= levels.indexOf(level)) {
              var _console;
              for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              (_console = console)[method].apply(_console, args);
            }
          }
          function namespace(ns) {
            return levels.reduce(function(logger, method) {
              logger[method] = debug.bind(console, method, ns);
              return logger;
            }, {});
          }
          debug.level = namespace.level = function(newLevel) {
            level = newLevel;
          };
          exports2.default = namespace;
        },
        function(module2, exports2, __webpack_require__) {
          var pSlice = Array.prototype.slice;
          var objectKeys = __webpack_require__(52);
          var isArguments = __webpack_require__(53);
          var deepEqual = module2.exports = function(actual, expected, opts) {
            if (!opts)
              opts = {};
            if (actual === expected) {
              return true;
            } else if (actual instanceof Date && expected instanceof Date) {
              return actual.getTime() === expected.getTime();
            } else if (!actual || !expected || typeof actual != "object" && typeof expected != "object") {
              return opts.strict ? actual === expected : actual == expected;
            } else {
              return objEquiv(actual, expected, opts);
            }
          };
          function isUndefinedOrNull(value) {
            return value === null || value === void 0;
          }
          function isBuffer(x) {
            if (!x || typeof x !== "object" || typeof x.length !== "number")
              return false;
            if (typeof x.copy !== "function" || typeof x.slice !== "function") {
              return false;
            }
            if (x.length > 0 && typeof x[0] !== "number")
              return false;
            return true;
          }
          function objEquiv(a, b, opts) {
            var i, key;
            if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
              return false;
            if (a.prototype !== b.prototype)
              return false;
            if (isArguments(a)) {
              if (!isArguments(b)) {
                return false;
              }
              a = pSlice.call(a);
              b = pSlice.call(b);
              return deepEqual(a, b, opts);
            }
            if (isBuffer(a)) {
              if (!isBuffer(b)) {
                return false;
              }
              if (a.length !== b.length)
                return false;
              for (i = 0; i < a.length; i++) {
                if (a[i] !== b[i])
                  return false;
              }
              return true;
            }
            try {
              var ka = objectKeys(a), kb = objectKeys(b);
            } catch (e) {
              return false;
            }
            if (ka.length != kb.length)
              return false;
            ka.sort();
            kb.sort();
            for (i = ka.length - 1; i >= 0; i--) {
              if (ka[i] != kb[i])
                return false;
            }
            for (i = ka.length - 1; i >= 0; i--) {
              key = ka[i];
              if (!deepEqual(a[key], b[key], opts))
                return false;
            }
            return typeof a === typeof b;
          }
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", { value: true });
          var Registry = __webpack_require__(1);
          var Attributor = function() {
            function Attributor2(attrName, keyName, options) {
              if (options === void 0) {
                options = {};
              }
              this.attrName = attrName;
              this.keyName = keyName;
              var attributeBit = Registry.Scope.TYPE & Registry.Scope.ATTRIBUTE;
              if (options.scope != null) {
                this.scope = options.scope & Registry.Scope.LEVEL | attributeBit;
              } else {
                this.scope = Registry.Scope.ATTRIBUTE;
              }
              if (options.whitelist != null)
                this.whitelist = options.whitelist;
            }
            Attributor2.keys = function(node) {
              return [].map.call(node.attributes, function(item) {
                return item.name;
              });
            };
            Attributor2.prototype.add = function(node, value) {
              if (!this.canAdd(node, value))
                return false;
              node.setAttribute(this.keyName, value);
              return true;
            };
            Attributor2.prototype.canAdd = function(node, value) {
              var match = Registry.query(node, Registry.Scope.BLOT & (this.scope | Registry.Scope.TYPE));
              if (match == null)
                return false;
              if (this.whitelist == null)
                return true;
              if (typeof value === "string") {
                return this.whitelist.indexOf(value.replace(/["']/g, "")) > -1;
              } else {
                return this.whitelist.indexOf(value) > -1;
              }
            };
            Attributor2.prototype.remove = function(node) {
              node.removeAttribute(this.keyName);
            };
            Attributor2.prototype.value = function(node) {
              var value = node.getAttribute(this.keyName);
              if (this.canAdd(node, value) && value) {
                return value;
              }
              return "";
            };
            return Attributor2;
          }();
          exports2.default = Attributor;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.default = exports2.Code = void 0;
          var _slicedToArray = function() {
            function sliceIterator(arr, i) {
              var _arr = [];
              var _n = true;
              var _d = false;
              var _e = void 0;
              try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                  _arr.push(_s.value);
                  if (i && _arr.length === i)
                    break;
                }
              } catch (err) {
                _d = true;
                _e = err;
              } finally {
                try {
                  if (!_n && _i["return"])
                    _i["return"]();
                } finally {
                  if (_d)
                    throw _e;
                }
              }
              return _arr;
            }
            return function(arr, i) {
              if (Array.isArray(arr)) {
                return arr;
              } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
              } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
              }
            };
          }();
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _quillDelta = __webpack_require__(2);
          var _quillDelta2 = _interopRequireDefault(_quillDelta);
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _block = __webpack_require__(4);
          var _block2 = _interopRequireDefault(_block);
          var _inline = __webpack_require__(6);
          var _inline2 = _interopRequireDefault(_inline);
          var _text = __webpack_require__(7);
          var _text2 = _interopRequireDefault(_text);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var Code = function(_Inline) {
            _inherits(Code2, _Inline);
            function Code2() {
              _classCallCheck(this, Code2);
              return _possibleConstructorReturn(this, (Code2.__proto__ || Object.getPrototypeOf(Code2)).apply(this, arguments));
            }
            return Code2;
          }(_inline2.default);
          Code.blotName = "code";
          Code.tagName = "CODE";
          var CodeBlock = function(_Block) {
            _inherits(CodeBlock2, _Block);
            function CodeBlock2() {
              _classCallCheck(this, CodeBlock2);
              return _possibleConstructorReturn(this, (CodeBlock2.__proto__ || Object.getPrototypeOf(CodeBlock2)).apply(this, arguments));
            }
            _createClass(CodeBlock2, [{
              key: "delta",
              value: function delta() {
                var _this3 = this;
                var text = this.domNode.textContent;
                if (text.endsWith("\n")) {
                  text = text.slice(0, -1);
                }
                return text.split("\n").reduce(function(delta2, frag) {
                  return delta2.insert(frag).insert("\n", _this3.formats());
                }, new _quillDelta2.default());
              }
            }, {
              key: "format",
              value: function format(name, value) {
                if (name === this.statics.blotName && value)
                  return;
                var _descendant = this.descendant(_text2.default, this.length() - 1), _descendant2 = _slicedToArray(_descendant, 1), text = _descendant2[0];
                if (text != null) {
                  text.deleteAt(text.length() - 1, 1);
                }
                _get(CodeBlock2.prototype.__proto__ || Object.getPrototypeOf(CodeBlock2.prototype), "format", this).call(this, name, value);
              }
            }, {
              key: "formatAt",
              value: function formatAt(index, length, name, value) {
                if (length === 0)
                  return;
                if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK) == null || name === this.statics.blotName && value === this.statics.formats(this.domNode)) {
                  return;
                }
                var nextNewline = this.newlineIndex(index);
                if (nextNewline < 0 || nextNewline >= index + length)
                  return;
                var prevNewline = this.newlineIndex(index, true) + 1;
                var isolateLength = nextNewline - prevNewline + 1;
                var blot = this.isolate(prevNewline, isolateLength);
                var next = blot.next;
                blot.format(name, value);
                if (next instanceof CodeBlock2) {
                  next.formatAt(0, index - prevNewline + length - isolateLength, name, value);
                }
              }
            }, {
              key: "insertAt",
              value: function insertAt(index, value, def) {
                if (def != null)
                  return;
                var _descendant3 = this.descendant(_text2.default, index), _descendant4 = _slicedToArray(_descendant3, 2), text = _descendant4[0], offset = _descendant4[1];
                text.insertAt(offset, value);
              }
            }, {
              key: "length",
              value: function length() {
                var length2 = this.domNode.textContent.length;
                if (!this.domNode.textContent.endsWith("\n")) {
                  return length2 + 1;
                }
                return length2;
              }
            }, {
              key: "newlineIndex",
              value: function newlineIndex(searchIndex) {
                var reverse = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                if (!reverse) {
                  var offset = this.domNode.textContent.slice(searchIndex).indexOf("\n");
                  return offset > -1 ? searchIndex + offset : -1;
                } else {
                  return this.domNode.textContent.slice(0, searchIndex).lastIndexOf("\n");
                }
              }
            }, {
              key: "optimize",
              value: function optimize(context) {
                if (!this.domNode.textContent.endsWith("\n")) {
                  this.appendChild(_parchment2.default.create("text", "\n"));
                }
                _get(CodeBlock2.prototype.__proto__ || Object.getPrototypeOf(CodeBlock2.prototype), "optimize", this).call(this, context);
                var next = this.next;
                if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && this.statics.formats(this.domNode) === next.statics.formats(next.domNode)) {
                  next.optimize(context);
                  next.moveChildren(this);
                  next.remove();
                }
              }
            }, {
              key: "replace",
              value: function replace(target) {
                _get(CodeBlock2.prototype.__proto__ || Object.getPrototypeOf(CodeBlock2.prototype), "replace", this).call(this, target);
                [].slice.call(this.domNode.querySelectorAll("*")).forEach(function(node) {
                  var blot = _parchment2.default.find(node);
                  if (blot == null) {
                    node.parentNode.removeChild(node);
                  } else if (blot instanceof _parchment2.default.Embed) {
                    blot.remove();
                  } else {
                    blot.unwrap();
                  }
                });
              }
            }], [{
              key: "create",
              value: function create(value) {
                var domNode = _get(CodeBlock2.__proto__ || Object.getPrototypeOf(CodeBlock2), "create", this).call(this, value);
                domNode.setAttribute("spellcheck", false);
                return domNode;
              }
            }, {
              key: "formats",
              value: function formats() {
                return true;
              }
            }]);
            return CodeBlock2;
          }(_block2.default);
          CodeBlock.blotName = "code-block";
          CodeBlock.tagName = "PRE";
          CodeBlock.TAB = "  ";
          exports2.Code = Code;
          exports2.default = CodeBlock;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
          } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
          var _slicedToArray = function() {
            function sliceIterator(arr, i) {
              var _arr = [];
              var _n = true;
              var _d = false;
              var _e = void 0;
              try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                  _arr.push(_s.value);
                  if (i && _arr.length === i)
                    break;
                }
              } catch (err) {
                _d = true;
                _e = err;
              } finally {
                try {
                  if (!_n && _i["return"])
                    _i["return"]();
                } finally {
                  if (_d)
                    throw _e;
                }
              }
              return _arr;
            }
            return function(arr, i) {
              if (Array.isArray(arr)) {
                return arr;
              } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
              } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
              }
            };
          }();
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _quillDelta = __webpack_require__(2);
          var _quillDelta2 = _interopRequireDefault(_quillDelta);
          var _op = __webpack_require__(20);
          var _op2 = _interopRequireDefault(_op);
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _code = __webpack_require__(13);
          var _code2 = _interopRequireDefault(_code);
          var _cursor = __webpack_require__(24);
          var _cursor2 = _interopRequireDefault(_cursor);
          var _block = __webpack_require__(4);
          var _block2 = _interopRequireDefault(_block);
          var _break = __webpack_require__(16);
          var _break2 = _interopRequireDefault(_break);
          var _clone = __webpack_require__(21);
          var _clone2 = _interopRequireDefault(_clone);
          var _deepEqual = __webpack_require__(11);
          var _deepEqual2 = _interopRequireDefault(_deepEqual);
          var _extend = __webpack_require__(3);
          var _extend2 = _interopRequireDefault(_extend);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _defineProperty(obj, key, value) {
            if (key in obj) {
              Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
            } else {
              obj[key] = value;
            }
            return obj;
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          var ASCII = /^[ -~]*$/;
          var Editor = function() {
            function Editor2(scroll) {
              _classCallCheck(this, Editor2);
              this.scroll = scroll;
              this.delta = this.getDelta();
            }
            _createClass(Editor2, [{
              key: "applyDelta",
              value: function applyDelta(delta) {
                var _this = this;
                var consumeNextNewline = false;
                this.scroll.update();
                var scrollLength = this.scroll.length();
                this.scroll.batchStart();
                delta = normalizeDelta(delta);
                delta.reduce(function(index, op) {
                  var length = op.retain || op.delete || op.insert.length || 1;
                  var attributes = op.attributes || {};
                  if (op.insert != null) {
                    if (typeof op.insert === "string") {
                      var text = op.insert;
                      if (text.endsWith("\n") && consumeNextNewline) {
                        consumeNextNewline = false;
                        text = text.slice(0, -1);
                      }
                      if (index >= scrollLength && !text.endsWith("\n")) {
                        consumeNextNewline = true;
                      }
                      _this.scroll.insertAt(index, text);
                      var _scroll$line = _this.scroll.line(index), _scroll$line2 = _slicedToArray(_scroll$line, 2), line = _scroll$line2[0], offset = _scroll$line2[1];
                      var formats = (0, _extend2.default)({}, (0, _block.bubbleFormats)(line));
                      if (line instanceof _block2.default) {
                        var _line$descendant = line.descendant(_parchment2.default.Leaf, offset), _line$descendant2 = _slicedToArray(_line$descendant, 1), leaf = _line$descendant2[0];
                        formats = (0, _extend2.default)(formats, (0, _block.bubbleFormats)(leaf));
                      }
                      attributes = _op2.default.attributes.diff(formats, attributes) || {};
                    } else if (_typeof(op.insert) === "object") {
                      var key = Object.keys(op.insert)[0];
                      if (key == null)
                        return index;
                      _this.scroll.insertAt(index, key, op.insert[key]);
                    }
                    scrollLength += length;
                  }
                  Object.keys(attributes).forEach(function(name) {
                    _this.scroll.formatAt(index, length, name, attributes[name]);
                  });
                  return index + length;
                }, 0);
                delta.reduce(function(index, op) {
                  if (typeof op.delete === "number") {
                    _this.scroll.deleteAt(index, op.delete);
                    return index;
                  }
                  return index + (op.retain || op.insert.length || 1);
                }, 0);
                this.scroll.batchEnd();
                return this.update(delta);
              }
            }, {
              key: "deleteText",
              value: function deleteText(index, length) {
                this.scroll.deleteAt(index, length);
                return this.update(new _quillDelta2.default().retain(index).delete(length));
              }
            }, {
              key: "formatLine",
              value: function formatLine(index, length) {
                var _this2 = this;
                var formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                this.scroll.update();
                Object.keys(formats).forEach(function(format) {
                  if (_this2.scroll.whitelist != null && !_this2.scroll.whitelist[format])
                    return;
                  var lines = _this2.scroll.lines(index, Math.max(length, 1));
                  var lengthRemaining = length;
                  lines.forEach(function(line) {
                    var lineLength = line.length();
                    if (!(line instanceof _code2.default)) {
                      line.format(format, formats[format]);
                    } else {
                      var codeIndex = index - line.offset(_this2.scroll);
                      var codeLength = line.newlineIndex(codeIndex + lengthRemaining) - codeIndex + 1;
                      line.formatAt(codeIndex, codeLength, format, formats[format]);
                    }
                    lengthRemaining -= lineLength;
                  });
                });
                this.scroll.optimize();
                return this.update(new _quillDelta2.default().retain(index).retain(length, (0, _clone2.default)(formats)));
              }
            }, {
              key: "formatText",
              value: function formatText(index, length) {
                var _this3 = this;
                var formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                Object.keys(formats).forEach(function(format) {
                  _this3.scroll.formatAt(index, length, format, formats[format]);
                });
                return this.update(new _quillDelta2.default().retain(index).retain(length, (0, _clone2.default)(formats)));
              }
            }, {
              key: "getContents",
              value: function getContents(index, length) {
                return this.delta.slice(index, index + length);
              }
            }, {
              key: "getDelta",
              value: function getDelta() {
                return this.scroll.lines().reduce(function(delta, line) {
                  return delta.concat(line.delta());
                }, new _quillDelta2.default());
              }
            }, {
              key: "getFormat",
              value: function getFormat(index) {
                var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
                var lines = [], leaves = [];
                if (length === 0) {
                  this.scroll.path(index).forEach(function(path) {
                    var _path = _slicedToArray(path, 1), blot = _path[0];
                    if (blot instanceof _block2.default) {
                      lines.push(blot);
                    } else if (blot instanceof _parchment2.default.Leaf) {
                      leaves.push(blot);
                    }
                  });
                } else {
                  lines = this.scroll.lines(index, length);
                  leaves = this.scroll.descendants(_parchment2.default.Leaf, index, length);
                }
                var formatsArr = [lines, leaves].map(function(blots) {
                  if (blots.length === 0)
                    return {};
                  var formats = (0, _block.bubbleFormats)(blots.shift());
                  while (Object.keys(formats).length > 0) {
                    var blot = blots.shift();
                    if (blot == null)
                      return formats;
                    formats = combineFormats((0, _block.bubbleFormats)(blot), formats);
                  }
                  return formats;
                });
                return _extend2.default.apply(_extend2.default, formatsArr);
              }
            }, {
              key: "getText",
              value: function getText(index, length) {
                return this.getContents(index, length).filter(function(op) {
                  return typeof op.insert === "string";
                }).map(function(op) {
                  return op.insert;
                }).join("");
              }
            }, {
              key: "insertEmbed",
              value: function insertEmbed(index, embed, value) {
                this.scroll.insertAt(index, embed, value);
                return this.update(new _quillDelta2.default().retain(index).insert(_defineProperty({}, embed, value)));
              }
            }, {
              key: "insertText",
              value: function insertText(index, text) {
                var _this4 = this;
                var formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
                this.scroll.insertAt(index, text);
                Object.keys(formats).forEach(function(format) {
                  _this4.scroll.formatAt(index, text.length, format, formats[format]);
                });
                return this.update(new _quillDelta2.default().retain(index).insert(text, (0, _clone2.default)(formats)));
              }
            }, {
              key: "isBlank",
              value: function isBlank() {
                if (this.scroll.children.length == 0)
                  return true;
                if (this.scroll.children.length > 1)
                  return false;
                var block = this.scroll.children.head;
                if (block.statics.blotName !== _block2.default.blotName)
                  return false;
                if (block.children.length > 1)
                  return false;
                return block.children.head instanceof _break2.default;
              }
            }, {
              key: "removeFormat",
              value: function removeFormat(index, length) {
                var text = this.getText(index, length);
                var _scroll$line3 = this.scroll.line(index + length), _scroll$line4 = _slicedToArray(_scroll$line3, 2), line = _scroll$line4[0], offset = _scroll$line4[1];
                var suffixLength = 0, suffix = new _quillDelta2.default();
                if (line != null) {
                  if (!(line instanceof _code2.default)) {
                    suffixLength = line.length() - offset;
                  } else {
                    suffixLength = line.newlineIndex(offset) - offset + 1;
                  }
                  suffix = line.delta().slice(offset, offset + suffixLength - 1).insert("\n");
                }
                var contents = this.getContents(index, length + suffixLength);
                var diff = contents.diff(new _quillDelta2.default().insert(text).concat(suffix));
                var delta = new _quillDelta2.default().retain(index).concat(diff);
                return this.applyDelta(delta);
              }
            }, {
              key: "update",
              value: function update(change) {
                var mutations = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
                var cursorIndex = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : void 0;
                var oldDelta = this.delta;
                if (mutations.length === 1 && mutations[0].type === "characterData" && mutations[0].target.data.match(ASCII) && _parchment2.default.find(mutations[0].target)) {
                  var textBlot = _parchment2.default.find(mutations[0].target);
                  var formats = (0, _block.bubbleFormats)(textBlot);
                  var index = textBlot.offset(this.scroll);
                  var oldValue = mutations[0].oldValue.replace(_cursor2.default.CONTENTS, "");
                  var oldText = new _quillDelta2.default().insert(oldValue);
                  var newText = new _quillDelta2.default().insert(textBlot.value());
                  var diffDelta = new _quillDelta2.default().retain(index).concat(oldText.diff(newText, cursorIndex));
                  change = diffDelta.reduce(function(delta, op) {
                    if (op.insert) {
                      return delta.insert(op.insert, formats);
                    } else {
                      return delta.push(op);
                    }
                  }, new _quillDelta2.default());
                  this.delta = oldDelta.compose(change);
                } else {
                  this.delta = this.getDelta();
                  if (!change || !(0, _deepEqual2.default)(oldDelta.compose(change), this.delta)) {
                    change = oldDelta.diff(this.delta, cursorIndex);
                  }
                }
                return change;
              }
            }]);
            return Editor2;
          }();
          function combineFormats(formats, combined) {
            return Object.keys(combined).reduce(function(merged, name) {
              if (formats[name] == null)
                return merged;
              if (combined[name] === formats[name]) {
                merged[name] = combined[name];
              } else if (Array.isArray(combined[name])) {
                if (combined[name].indexOf(formats[name]) < 0) {
                  merged[name] = combined[name].concat([formats[name]]);
                }
              } else {
                merged[name] = [combined[name], formats[name]];
              }
              return merged;
            }, {});
          }
          function normalizeDelta(delta) {
            return delta.reduce(function(delta2, op) {
              if (op.insert === 1) {
                var attributes = (0, _clone2.default)(op.attributes);
                delete attributes["image"];
                return delta2.insert({ image: op.attributes.image }, attributes);
              }
              if (op.attributes != null && (op.attributes.list === true || op.attributes.bullet === true)) {
                op = (0, _clone2.default)(op);
                if (op.attributes.list) {
                  op.attributes.list = "ordered";
                } else {
                  op.attributes.list = "bullet";
                  delete op.attributes.bullet;
                }
              }
              if (typeof op.insert === "string") {
                var text = op.insert.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
                return delta2.insert(text, op.attributes);
              }
              return delta2.push(op);
            }, new _quillDelta2.default());
          }
          exports2.default = Editor;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.default = exports2.Range = void 0;
          var _slicedToArray = function() {
            function sliceIterator(arr, i) {
              var _arr = [];
              var _n = true;
              var _d = false;
              var _e = void 0;
              try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                  _arr.push(_s.value);
                  if (i && _arr.length === i)
                    break;
                }
              } catch (err) {
                _d = true;
                _e = err;
              } finally {
                try {
                  if (!_n && _i["return"])
                    _i["return"]();
                } finally {
                  if (_d)
                    throw _e;
                }
              }
              return _arr;
            }
            return function(arr, i) {
              if (Array.isArray(arr)) {
                return arr;
              } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
              } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
              }
            };
          }();
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _clone = __webpack_require__(21);
          var _clone2 = _interopRequireDefault(_clone);
          var _deepEqual = __webpack_require__(11);
          var _deepEqual2 = _interopRequireDefault(_deepEqual);
          var _emitter3 = __webpack_require__(8);
          var _emitter4 = _interopRequireDefault(_emitter3);
          var _logger = __webpack_require__(10);
          var _logger2 = _interopRequireDefault(_logger);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _toConsumableArray(arr) {
            if (Array.isArray(arr)) {
              for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
              }
              return arr2;
            } else {
              return Array.from(arr);
            }
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          var debug = (0, _logger2.default)("quill:selection");
          var Range = function Range2(index) {
            var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
            _classCallCheck(this, Range2);
            this.index = index;
            this.length = length;
          };
          var Selection = function() {
            function Selection2(scroll, emitter) {
              var _this = this;
              _classCallCheck(this, Selection2);
              this.emitter = emitter;
              this.scroll = scroll;
              this.composing = false;
              this.mouseDown = false;
              this.root = this.scroll.domNode;
              this.cursor = _parchment2.default.create("cursor", this);
              this.lastRange = this.savedRange = new Range(0, 0);
              this.handleComposition();
              this.handleDragging();
              this.emitter.listenDOM("selectionchange", document, function() {
                if (!_this.mouseDown) {
                  setTimeout(_this.update.bind(_this, _emitter4.default.sources.USER), 1);
                }
              });
              this.emitter.on(_emitter4.default.events.EDITOR_CHANGE, function(type, delta) {
                if (type === _emitter4.default.events.TEXT_CHANGE && delta.length() > 0) {
                  _this.update(_emitter4.default.sources.SILENT);
                }
              });
              this.emitter.on(_emitter4.default.events.SCROLL_BEFORE_UPDATE, function() {
                if (!_this.hasFocus())
                  return;
                var native = _this.getNativeRange();
                if (native == null)
                  return;
                if (native.start.node === _this.cursor.textNode)
                  return;
                _this.emitter.once(_emitter4.default.events.SCROLL_UPDATE, function() {
                  try {
                    _this.setNativeRange(native.start.node, native.start.offset, native.end.node, native.end.offset);
                  } catch (ignored) {
                  }
                });
              });
              this.emitter.on(_emitter4.default.events.SCROLL_OPTIMIZE, function(mutations, context) {
                if (context.range) {
                  var _context$range = context.range, startNode = _context$range.startNode, startOffset = _context$range.startOffset, endNode = _context$range.endNode, endOffset = _context$range.endOffset;
                  _this.setNativeRange(startNode, startOffset, endNode, endOffset);
                }
              });
              this.update(_emitter4.default.sources.SILENT);
            }
            _createClass(Selection2, [{
              key: "handleComposition",
              value: function handleComposition() {
                var _this2 = this;
                this.root.addEventListener("compositionstart", function() {
                  _this2.composing = true;
                });
                this.root.addEventListener("compositionend", function() {
                  _this2.composing = false;
                  if (_this2.cursor.parent) {
                    var range = _this2.cursor.restore();
                    if (!range)
                      return;
                    setTimeout(function() {
                      _this2.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
                    }, 1);
                  }
                });
              }
            }, {
              key: "handleDragging",
              value: function handleDragging() {
                var _this3 = this;
                this.emitter.listenDOM("mousedown", document.body, function() {
                  _this3.mouseDown = true;
                });
                this.emitter.listenDOM("mouseup", document.body, function() {
                  _this3.mouseDown = false;
                  _this3.update(_emitter4.default.sources.USER);
                });
              }
            }, {
              key: "focus",
              value: function focus() {
                if (this.hasFocus())
                  return;
                this.root.focus();
                this.setRange(this.savedRange);
              }
            }, {
              key: "format",
              value: function format(_format, value) {
                if (this.scroll.whitelist != null && !this.scroll.whitelist[_format])
                  return;
                this.scroll.update();
                var nativeRange = this.getNativeRange();
                if (nativeRange == null || !nativeRange.native.collapsed || _parchment2.default.query(_format, _parchment2.default.Scope.BLOCK))
                  return;
                if (nativeRange.start.node !== this.cursor.textNode) {
                  var blot = _parchment2.default.find(nativeRange.start.node, false);
                  if (blot == null)
                    return;
                  if (blot instanceof _parchment2.default.Leaf) {
                    var after = blot.split(nativeRange.start.offset);
                    blot.parent.insertBefore(this.cursor, after);
                  } else {
                    blot.insertBefore(this.cursor, nativeRange.start.node);
                  }
                  this.cursor.attach();
                }
                this.cursor.format(_format, value);
                this.scroll.optimize();
                this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length);
                this.update();
              }
            }, {
              key: "getBounds",
              value: function getBounds(index) {
                var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
                var scrollLength = this.scroll.length();
                index = Math.min(index, scrollLength - 1);
                length = Math.min(index + length, scrollLength - 1) - index;
                var node = void 0, _scroll$leaf = this.scroll.leaf(index), _scroll$leaf2 = _slicedToArray(_scroll$leaf, 2), leaf = _scroll$leaf2[0], offset = _scroll$leaf2[1];
                if (leaf == null)
                  return null;
                var _leaf$position = leaf.position(offset, true);
                var _leaf$position2 = _slicedToArray(_leaf$position, 2);
                node = _leaf$position2[0];
                offset = _leaf$position2[1];
                var range = document.createRange();
                if (length > 0) {
                  range.setStart(node, offset);
                  var _scroll$leaf3 = this.scroll.leaf(index + length);
                  var _scroll$leaf4 = _slicedToArray(_scroll$leaf3, 2);
                  leaf = _scroll$leaf4[0];
                  offset = _scroll$leaf4[1];
                  if (leaf == null)
                    return null;
                  var _leaf$position3 = leaf.position(offset, true);
                  var _leaf$position4 = _slicedToArray(_leaf$position3, 2);
                  node = _leaf$position4[0];
                  offset = _leaf$position4[1];
                  range.setEnd(node, offset);
                  return range.getBoundingClientRect();
                } else {
                  var side = "left";
                  var rect = void 0;
                  if (node instanceof Text) {
                    if (offset < node.data.length) {
                      range.setStart(node, offset);
                      range.setEnd(node, offset + 1);
                    } else {
                      range.setStart(node, offset - 1);
                      range.setEnd(node, offset);
                      side = "right";
                    }
                    rect = range.getBoundingClientRect();
                  } else {
                    rect = leaf.domNode.getBoundingClientRect();
                    if (offset > 0)
                      side = "right";
                  }
                  return {
                    bottom: rect.top + rect.height,
                    height: rect.height,
                    left: rect[side],
                    right: rect[side],
                    top: rect.top,
                    width: 0
                  };
                }
              }
            }, {
              key: "getNativeRange",
              value: function getNativeRange() {
                var selection = document.getSelection();
                if (selection == null || selection.rangeCount <= 0)
                  return null;
                var nativeRange = selection.getRangeAt(0);
                if (nativeRange == null)
                  return null;
                var range = this.normalizeNative(nativeRange);
                debug.info("getNativeRange", range);
                return range;
              }
            }, {
              key: "getRange",
              value: function getRange() {
                var normalized = this.getNativeRange();
                if (normalized == null)
                  return [null, null];
                var range = this.normalizedToRange(normalized);
                return [range, normalized];
              }
            }, {
              key: "hasFocus",
              value: function hasFocus() {
                return document.activeElement === this.root;
              }
            }, {
              key: "normalizedToRange",
              value: function normalizedToRange(range) {
                var _this4 = this;
                var positions = [[range.start.node, range.start.offset]];
                if (!range.native.collapsed) {
                  positions.push([range.end.node, range.end.offset]);
                }
                var indexes = positions.map(function(position) {
                  var _position = _slicedToArray(position, 2), node = _position[0], offset = _position[1];
                  var blot = _parchment2.default.find(node, true);
                  var index = blot.offset(_this4.scroll);
                  if (offset === 0) {
                    return index;
                  } else if (blot instanceof _parchment2.default.Container) {
                    return index + blot.length();
                  } else {
                    return index + blot.index(node, offset);
                  }
                });
                var end = Math.min(Math.max.apply(Math, _toConsumableArray(indexes)), this.scroll.length() - 1);
                var start = Math.min.apply(Math, [end].concat(_toConsumableArray(indexes)));
                return new Range(start, end - start);
              }
            }, {
              key: "normalizeNative",
              value: function normalizeNative(nativeRange) {
                if (!contains(this.root, nativeRange.startContainer) || !nativeRange.collapsed && !contains(this.root, nativeRange.endContainer)) {
                  return null;
                }
                var range = {
                  start: { node: nativeRange.startContainer, offset: nativeRange.startOffset },
                  end: { node: nativeRange.endContainer, offset: nativeRange.endOffset },
                  native: nativeRange
                };
                [range.start, range.end].forEach(function(position) {
                  var node = position.node, offset = position.offset;
                  while (!(node instanceof Text) && node.childNodes.length > 0) {
                    if (node.childNodes.length > offset) {
                      node = node.childNodes[offset];
                      offset = 0;
                    } else if (node.childNodes.length === offset) {
                      node = node.lastChild;
                      offset = node instanceof Text ? node.data.length : node.childNodes.length + 1;
                    } else {
                      break;
                    }
                  }
                  position.node = node, position.offset = offset;
                });
                return range;
              }
            }, {
              key: "rangeToNative",
              value: function rangeToNative(range) {
                var _this5 = this;
                var indexes = range.collapsed ? [range.index] : [range.index, range.index + range.length];
                var args = [];
                var scrollLength = this.scroll.length();
                indexes.forEach(function(index, i) {
                  index = Math.min(scrollLength - 1, index);
                  var node = void 0, _scroll$leaf5 = _this5.scroll.leaf(index), _scroll$leaf6 = _slicedToArray(_scroll$leaf5, 2), leaf = _scroll$leaf6[0], offset = _scroll$leaf6[1];
                  var _leaf$position5 = leaf.position(offset, i !== 0);
                  var _leaf$position6 = _slicedToArray(_leaf$position5, 2);
                  node = _leaf$position6[0];
                  offset = _leaf$position6[1];
                  args.push(node, offset);
                });
                if (args.length < 2) {
                  args = args.concat(args);
                }
                return args;
              }
            }, {
              key: "scrollIntoView",
              value: function scrollIntoView(scrollingContainer) {
                var range = this.lastRange;
                if (range == null)
                  return;
                var bounds = this.getBounds(range.index, range.length);
                if (bounds == null)
                  return;
                var limit = this.scroll.length() - 1;
                var _scroll$line = this.scroll.line(Math.min(range.index, limit)), _scroll$line2 = _slicedToArray(_scroll$line, 1), first = _scroll$line2[0];
                var last = first;
                if (range.length > 0) {
                  var _scroll$line3 = this.scroll.line(Math.min(range.index + range.length, limit));
                  var _scroll$line4 = _slicedToArray(_scroll$line3, 1);
                  last = _scroll$line4[0];
                }
                if (first == null || last == null)
                  return;
                var scrollBounds = scrollingContainer.getBoundingClientRect();
                if (bounds.top < scrollBounds.top) {
                  scrollingContainer.scrollTop -= scrollBounds.top - bounds.top;
                } else if (bounds.bottom > scrollBounds.bottom) {
                  scrollingContainer.scrollTop += bounds.bottom - scrollBounds.bottom;
                }
              }
            }, {
              key: "setNativeRange",
              value: function setNativeRange(startNode, startOffset) {
                var endNode = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : startNode;
                var endOffset = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : startOffset;
                var force = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
                debug.info("setNativeRange", startNode, startOffset, endNode, endOffset);
                if (startNode != null && (this.root.parentNode == null || startNode.parentNode == null || endNode.parentNode == null)) {
                  return;
                }
                var selection = document.getSelection();
                if (selection == null)
                  return;
                if (startNode != null) {
                  if (!this.hasFocus())
                    this.root.focus();
                  var native = (this.getNativeRange() || {}).native;
                  if (native == null || force || startNode !== native.startContainer || startOffset !== native.startOffset || endNode !== native.endContainer || endOffset !== native.endOffset) {
                    if (startNode.tagName == "BR") {
                      startOffset = [].indexOf.call(startNode.parentNode.childNodes, startNode);
                      startNode = startNode.parentNode;
                    }
                    if (endNode.tagName == "BR") {
                      endOffset = [].indexOf.call(endNode.parentNode.childNodes, endNode);
                      endNode = endNode.parentNode;
                    }
                    var range = document.createRange();
                    range.setStart(startNode, startOffset);
                    range.setEnd(endNode, endOffset);
                    selection.removeAllRanges();
                    selection.addRange(range);
                  }
                } else {
                  selection.removeAllRanges();
                  this.root.blur();
                  document.body.focus();
                }
              }
            }, {
              key: "setRange",
              value: function setRange(range) {
                var force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                var source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _emitter4.default.sources.API;
                if (typeof force === "string") {
                  source = force;
                  force = false;
                }
                debug.info("setRange", range);
                if (range != null) {
                  var args = this.rangeToNative(range);
                  this.setNativeRange.apply(this, _toConsumableArray(args).concat([force]));
                } else {
                  this.setNativeRange(null);
                }
                this.update(source);
              }
            }, {
              key: "update",
              value: function update() {
                var source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _emitter4.default.sources.USER;
                var oldRange = this.lastRange;
                var _getRange = this.getRange(), _getRange2 = _slicedToArray(_getRange, 2), lastRange = _getRange2[0], nativeRange = _getRange2[1];
                this.lastRange = lastRange;
                if (this.lastRange != null) {
                  this.savedRange = this.lastRange;
                }
                if (!(0, _deepEqual2.default)(oldRange, this.lastRange)) {
                  var _emitter;
                  if (!this.composing && nativeRange != null && nativeRange.native.collapsed && nativeRange.start.node !== this.cursor.textNode) {
                    this.cursor.restore();
                  }
                  var args = [_emitter4.default.events.SELECTION_CHANGE, (0, _clone2.default)(this.lastRange), (0, _clone2.default)(oldRange), source];
                  (_emitter = this.emitter).emit.apply(_emitter, [_emitter4.default.events.EDITOR_CHANGE].concat(args));
                  if (source !== _emitter4.default.sources.SILENT) {
                    var _emitter2;
                    (_emitter2 = this.emitter).emit.apply(_emitter2, args);
                  }
                }
              }
            }]);
            return Selection2;
          }();
          function contains(parent, descendant) {
            try {
              descendant.parentNode;
            } catch (e) {
              return false;
            }
            if (descendant instanceof Text) {
              descendant = descendant.parentNode;
            }
            return parent.contains(descendant);
          }
          exports2.Range = Range;
          exports2.default = Selection;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var Break = function(_Parchment$Embed) {
            _inherits(Break2, _Parchment$Embed);
            function Break2() {
              _classCallCheck(this, Break2);
              return _possibleConstructorReturn(this, (Break2.__proto__ || Object.getPrototypeOf(Break2)).apply(this, arguments));
            }
            _createClass(Break2, [{
              key: "insertInto",
              value: function insertInto(parent, ref) {
                if (parent.children.length === 0) {
                  _get(Break2.prototype.__proto__ || Object.getPrototypeOf(Break2.prototype), "insertInto", this).call(this, parent, ref);
                } else {
                  this.remove();
                }
              }
            }, {
              key: "length",
              value: function length() {
                return 0;
              }
            }, {
              key: "value",
              value: function value() {
                return "";
              }
            }], [{
              key: "value",
              value: function value() {
                return void 0;
              }
            }]);
            return Break2;
          }(_parchment2.default.Embed);
          Break.blotName = "break";
          Break.tagName = "BR";
          exports2.default = Break;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
              d.__proto__ = b;
            } || function(d, b) {
              for (var p in b)
                if (b.hasOwnProperty(p))
                  d[p] = b[p];
            };
            return function(d, b) {
              extendStatics(d, b);
              function __() {
                this.constructor = d;
              }
              d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
          }();
          Object.defineProperty(exports2, "__esModule", { value: true });
          var linked_list_1 = __webpack_require__(44);
          var shadow_1 = __webpack_require__(30);
          var Registry = __webpack_require__(1);
          var ContainerBlot = function(_super) {
            __extends(ContainerBlot2, _super);
            function ContainerBlot2(domNode) {
              var _this = _super.call(this, domNode) || this;
              _this.build();
              return _this;
            }
            ContainerBlot2.prototype.appendChild = function(other) {
              this.insertBefore(other);
            };
            ContainerBlot2.prototype.attach = function() {
              _super.prototype.attach.call(this);
              this.children.forEach(function(child) {
                child.attach();
              });
            };
            ContainerBlot2.prototype.build = function() {
              var _this = this;
              this.children = new linked_list_1.default();
              [].slice.call(this.domNode.childNodes).reverse().forEach(function(node) {
                try {
                  var child = makeBlot(node);
                  _this.insertBefore(child, _this.children.head || void 0);
                } catch (err) {
                  if (err instanceof Registry.ParchmentError)
                    return;
                  else
                    throw err;
                }
              });
            };
            ContainerBlot2.prototype.deleteAt = function(index, length) {
              if (index === 0 && length === this.length()) {
                return this.remove();
              }
              this.children.forEachAt(index, length, function(child, offset, length2) {
                child.deleteAt(offset, length2);
              });
            };
            ContainerBlot2.prototype.descendant = function(criteria, index) {
              var _a = this.children.find(index), child = _a[0], offset = _a[1];
              if (criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) {
                return [child, offset];
              } else if (child instanceof ContainerBlot2) {
                return child.descendant(criteria, offset);
              } else {
                return [null, -1];
              }
            };
            ContainerBlot2.prototype.descendants = function(criteria, index, length) {
              if (index === void 0) {
                index = 0;
              }
              if (length === void 0) {
                length = Number.MAX_VALUE;
              }
              var descendants = [];
              var lengthLeft = length;
              this.children.forEachAt(index, length, function(child, index2, length2) {
                if (criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) {
                  descendants.push(child);
                }
                if (child instanceof ContainerBlot2) {
                  descendants = descendants.concat(child.descendants(criteria, index2, lengthLeft));
                }
                lengthLeft -= length2;
              });
              return descendants;
            };
            ContainerBlot2.prototype.detach = function() {
              this.children.forEach(function(child) {
                child.detach();
              });
              _super.prototype.detach.call(this);
            };
            ContainerBlot2.prototype.formatAt = function(index, length, name, value) {
              this.children.forEachAt(index, length, function(child, offset, length2) {
                child.formatAt(offset, length2, name, value);
              });
            };
            ContainerBlot2.prototype.insertAt = function(index, value, def) {
              var _a = this.children.find(index), child = _a[0], offset = _a[1];
              if (child) {
                child.insertAt(offset, value, def);
              } else {
                var blot = def == null ? Registry.create("text", value) : Registry.create(value, def);
                this.appendChild(blot);
              }
            };
            ContainerBlot2.prototype.insertBefore = function(childBlot, refBlot) {
              if (this.statics.allowedChildren != null && !this.statics.allowedChildren.some(function(child) {
                return childBlot instanceof child;
              })) {
                throw new Registry.ParchmentError("Cannot insert " + childBlot.statics.blotName + " into " + this.statics.blotName);
              }
              childBlot.insertInto(this, refBlot);
            };
            ContainerBlot2.prototype.length = function() {
              return this.children.reduce(function(memo, child) {
                return memo + child.length();
              }, 0);
            };
            ContainerBlot2.prototype.moveChildren = function(targetParent, refNode) {
              this.children.forEach(function(child) {
                targetParent.insertBefore(child, refNode);
              });
            };
            ContainerBlot2.prototype.optimize = function(context) {
              _super.prototype.optimize.call(this, context);
              if (this.children.length === 0) {
                if (this.statics.defaultChild != null) {
                  var child = Registry.create(this.statics.defaultChild);
                  this.appendChild(child);
                  child.optimize(context);
                } else {
                  this.remove();
                }
              }
            };
            ContainerBlot2.prototype.path = function(index, inclusive) {
              if (inclusive === void 0) {
                inclusive = false;
              }
              var _a = this.children.find(index, inclusive), child = _a[0], offset = _a[1];
              var position = [[this, index]];
              if (child instanceof ContainerBlot2) {
                return position.concat(child.path(offset, inclusive));
              } else if (child != null) {
                position.push([child, offset]);
              }
              return position;
            };
            ContainerBlot2.prototype.removeChild = function(child) {
              this.children.remove(child);
            };
            ContainerBlot2.prototype.replace = function(target) {
              if (target instanceof ContainerBlot2) {
                target.moveChildren(this);
              }
              _super.prototype.replace.call(this, target);
            };
            ContainerBlot2.prototype.split = function(index, force) {
              if (force === void 0) {
                force = false;
              }
              if (!force) {
                if (index === 0)
                  return this;
                if (index === this.length())
                  return this.next;
              }
              var after = this.clone();
              this.parent.insertBefore(after, this.next);
              this.children.forEachAt(index, this.length(), function(child, offset, length) {
                child = child.split(offset, force);
                after.appendChild(child);
              });
              return after;
            };
            ContainerBlot2.prototype.unwrap = function() {
              this.moveChildren(this.parent, this.next);
              this.remove();
            };
            ContainerBlot2.prototype.update = function(mutations, context) {
              var _this = this;
              var addedNodes = [];
              var removedNodes = [];
              mutations.forEach(function(mutation) {
                if (mutation.target === _this.domNode && mutation.type === "childList") {
                  addedNodes.push.apply(addedNodes, mutation.addedNodes);
                  removedNodes.push.apply(removedNodes, mutation.removedNodes);
                }
              });
              removedNodes.forEach(function(node) {
                if (node.parentNode != null && node.tagName !== "IFRAME" && document.body.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
                  return;
                }
                var blot = Registry.find(node);
                if (blot == null)
                  return;
                if (blot.domNode.parentNode == null || blot.domNode.parentNode === _this.domNode) {
                  blot.detach();
                }
              });
              addedNodes.filter(function(node) {
                return node.parentNode == _this.domNode;
              }).sort(function(a, b) {
                if (a === b)
                  return 0;
                if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
                  return 1;
                }
                return -1;
              }).forEach(function(node) {
                var refBlot = null;
                if (node.nextSibling != null) {
                  refBlot = Registry.find(node.nextSibling);
                }
                var blot = makeBlot(node);
                if (blot.next != refBlot || blot.next == null) {
                  if (blot.parent != null) {
                    blot.parent.removeChild(_this);
                  }
                  _this.insertBefore(blot, refBlot || void 0);
                }
              });
            };
            return ContainerBlot2;
          }(shadow_1.default);
          function makeBlot(node) {
            var blot = Registry.find(node);
            if (blot == null) {
              try {
                blot = Registry.create(node);
              } catch (e) {
                blot = Registry.create(Registry.Scope.INLINE);
                [].slice.call(node.childNodes).forEach(function(child) {
                  blot.domNode.appendChild(child);
                });
                if (node.parentNode) {
                  node.parentNode.replaceChild(blot.domNode, node);
                }
                blot.attach();
              }
            }
            return blot;
          }
          exports2.default = ContainerBlot;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
              d.__proto__ = b;
            } || function(d, b) {
              for (var p in b)
                if (b.hasOwnProperty(p))
                  d[p] = b[p];
            };
            return function(d, b) {
              extendStatics(d, b);
              function __() {
                this.constructor = d;
              }
              d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
          }();
          Object.defineProperty(exports2, "__esModule", { value: true });
          var attributor_1 = __webpack_require__(12);
          var store_1 = __webpack_require__(31);
          var container_1 = __webpack_require__(17);
          var Registry = __webpack_require__(1);
          var FormatBlot = function(_super) {
            __extends(FormatBlot2, _super);
            function FormatBlot2(domNode) {
              var _this = _super.call(this, domNode) || this;
              _this.attributes = new store_1.default(_this.domNode);
              return _this;
            }
            FormatBlot2.formats = function(domNode) {
              if (typeof this.tagName === "string") {
                return true;
              } else if (Array.isArray(this.tagName)) {
                return domNode.tagName.toLowerCase();
              }
              return void 0;
            };
            FormatBlot2.prototype.format = function(name, value) {
              var format = Registry.query(name);
              if (format instanceof attributor_1.default) {
                this.attributes.attribute(format, value);
              } else if (value) {
                if (format != null && (name !== this.statics.blotName || this.formats()[name] !== value)) {
                  this.replaceWith(name, value);
                }
              }
            };
            FormatBlot2.prototype.formats = function() {
              var formats = this.attributes.values();
              var format = this.statics.formats(this.domNode);
              if (format != null) {
                formats[this.statics.blotName] = format;
              }
              return formats;
            };
            FormatBlot2.prototype.replaceWith = function(name, value) {
              var replacement = _super.prototype.replaceWith.call(this, name, value);
              this.attributes.copy(replacement);
              return replacement;
            };
            FormatBlot2.prototype.update = function(mutations, context) {
              var _this = this;
              _super.prototype.update.call(this, mutations, context);
              if (mutations.some(function(mutation) {
                return mutation.target === _this.domNode && mutation.type === "attributes";
              })) {
                this.attributes.build();
              }
            };
            FormatBlot2.prototype.wrap = function(name, value) {
              var wrapper = _super.prototype.wrap.call(this, name, value);
              if (wrapper instanceof FormatBlot2 && wrapper.statics.scope === this.statics.scope) {
                this.attributes.move(wrapper);
              }
              return wrapper;
            };
            return FormatBlot2;
          }(container_1.default);
          exports2.default = FormatBlot;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
              d.__proto__ = b;
            } || function(d, b) {
              for (var p in b)
                if (b.hasOwnProperty(p))
                  d[p] = b[p];
            };
            return function(d, b) {
              extendStatics(d, b);
              function __() {
                this.constructor = d;
              }
              d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
          }();
          Object.defineProperty(exports2, "__esModule", { value: true });
          var shadow_1 = __webpack_require__(30);
          var Registry = __webpack_require__(1);
          var LeafBlot = function(_super) {
            __extends(LeafBlot2, _super);
            function LeafBlot2() {
              return _super !== null && _super.apply(this, arguments) || this;
            }
            LeafBlot2.value = function(domNode) {
              return true;
            };
            LeafBlot2.prototype.index = function(node, offset) {
              if (this.domNode === node || this.domNode.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
                return Math.min(offset, 1);
              }
              return -1;
            };
            LeafBlot2.prototype.position = function(index, inclusive) {
              var offset = [].indexOf.call(this.parent.domNode.childNodes, this.domNode);
              if (index > 0)
                offset += 1;
              return [this.parent.domNode, offset];
            };
            LeafBlot2.prototype.value = function() {
              var _a;
              return _a = {}, _a[this.statics.blotName] = this.statics.value(this.domNode) || true, _a;
            };
            LeafBlot2.scope = Registry.Scope.INLINE_BLOT;
            return LeafBlot2;
          }(shadow_1.default);
          exports2.default = LeafBlot;
        },
        function(module2, exports2, __webpack_require__) {
          var equal = __webpack_require__(11);
          var extend = __webpack_require__(3);
          var lib = {
            attributes: {
              compose: function(a, b, keepNull) {
                if (typeof a !== "object")
                  a = {};
                if (typeof b !== "object")
                  b = {};
                var attributes = extend(true, {}, b);
                if (!keepNull) {
                  attributes = Object.keys(attributes).reduce(function(copy, key2) {
                    if (attributes[key2] != null) {
                      copy[key2] = attributes[key2];
                    }
                    return copy;
                  }, {});
                }
                for (var key in a) {
                  if (a[key] !== void 0 && b[key] === void 0) {
                    attributes[key] = a[key];
                  }
                }
                return Object.keys(attributes).length > 0 ? attributes : void 0;
              },
              diff: function(a, b) {
                if (typeof a !== "object")
                  a = {};
                if (typeof b !== "object")
                  b = {};
                var attributes = Object.keys(a).concat(Object.keys(b)).reduce(function(attributes2, key) {
                  if (!equal(a[key], b[key])) {
                    attributes2[key] = b[key] === void 0 ? null : b[key];
                  }
                  return attributes2;
                }, {});
                return Object.keys(attributes).length > 0 ? attributes : void 0;
              },
              transform: function(a, b, priority) {
                if (typeof a !== "object")
                  return b;
                if (typeof b !== "object")
                  return void 0;
                if (!priority)
                  return b;
                var attributes = Object.keys(b).reduce(function(attributes2, key) {
                  if (a[key] === void 0)
                    attributes2[key] = b[key];
                  return attributes2;
                }, {});
                return Object.keys(attributes).length > 0 ? attributes : void 0;
              }
            },
            iterator: function(ops) {
              return new Iterator(ops);
            },
            length: function(op) {
              if (typeof op["delete"] === "number") {
                return op["delete"];
              } else if (typeof op.retain === "number") {
                return op.retain;
              } else {
                return typeof op.insert === "string" ? op.insert.length : 1;
              }
            }
          };
          function Iterator(ops) {
            this.ops = ops;
            this.index = 0;
            this.offset = 0;
          }
          ;
          Iterator.prototype.hasNext = function() {
            return this.peekLength() < Infinity;
          };
          Iterator.prototype.next = function(length) {
            if (!length)
              length = Infinity;
            var nextOp = this.ops[this.index];
            if (nextOp) {
              var offset = this.offset;
              var opLength = lib.length(nextOp);
              if (length >= opLength - offset) {
                length = opLength - offset;
                this.index += 1;
                this.offset = 0;
              } else {
                this.offset += length;
              }
              if (typeof nextOp["delete"] === "number") {
                return { "delete": length };
              } else {
                var retOp = {};
                if (nextOp.attributes) {
                  retOp.attributes = nextOp.attributes;
                }
                if (typeof nextOp.retain === "number") {
                  retOp.retain = length;
                } else if (typeof nextOp.insert === "string") {
                  retOp.insert = nextOp.insert.substr(offset, length);
                } else {
                  retOp.insert = nextOp.insert;
                }
                return retOp;
              }
            } else {
              return { retain: Infinity };
            }
          };
          Iterator.prototype.peek = function() {
            return this.ops[this.index];
          };
          Iterator.prototype.peekLength = function() {
            if (this.ops[this.index]) {
              return lib.length(this.ops[this.index]) - this.offset;
            } else {
              return Infinity;
            }
          };
          Iterator.prototype.peekType = function() {
            if (this.ops[this.index]) {
              if (typeof this.ops[this.index]["delete"] === "number") {
                return "delete";
              } else if (typeof this.ops[this.index].retain === "number") {
                return "retain";
              } else {
                return "insert";
              }
            }
            return "retain";
          };
          Iterator.prototype.rest = function() {
            if (!this.hasNext()) {
              return [];
            } else if (this.offset === 0) {
              return this.ops.slice(this.index);
            } else {
              var offset = this.offset;
              var index = this.index;
              var next = this.next();
              var rest = this.ops.slice(this.index);
              this.offset = offset;
              this.index = index;
              return [next].concat(rest);
            }
          };
          module2.exports = lib;
        },
        function(module2, exports2) {
          var clone = function() {
            "use strict";
            function _instanceof(obj, type) {
              return type != null && obj instanceof type;
            }
            var nativeMap;
            try {
              nativeMap = Map;
            } catch (_) {
              nativeMap = function() {
              };
            }
            var nativeSet;
            try {
              nativeSet = Set;
            } catch (_) {
              nativeSet = function() {
              };
            }
            var nativePromise;
            try {
              nativePromise = Promise;
            } catch (_) {
              nativePromise = function() {
              };
            }
            function clone2(parent, circular, depth, prototype, includeNonEnumerable) {
              if (typeof circular === "object") {
                depth = circular.depth;
                prototype = circular.prototype;
                includeNonEnumerable = circular.includeNonEnumerable;
                circular = circular.circular;
              }
              var allParents = [];
              var allChildren = [];
              var useBuffer = typeof Buffer != "undefined";
              if (typeof circular == "undefined")
                circular = true;
              if (typeof depth == "undefined")
                depth = Infinity;
              function _clone(parent2, depth2) {
                if (parent2 === null)
                  return null;
                if (depth2 === 0)
                  return parent2;
                var child;
                var proto;
                if (typeof parent2 != "object") {
                  return parent2;
                }
                if (_instanceof(parent2, nativeMap)) {
                  child = new nativeMap();
                } else if (_instanceof(parent2, nativeSet)) {
                  child = new nativeSet();
                } else if (_instanceof(parent2, nativePromise)) {
                  child = new nativePromise(function(resolve, reject) {
                    parent2.then(function(value) {
                      resolve(_clone(value, depth2 - 1));
                    }, function(err) {
                      reject(_clone(err, depth2 - 1));
                    });
                  });
                } else if (clone2.__isArray(parent2)) {
                  child = [];
                } else if (clone2.__isRegExp(parent2)) {
                  child = new RegExp(parent2.source, __getRegExpFlags(parent2));
                  if (parent2.lastIndex)
                    child.lastIndex = parent2.lastIndex;
                } else if (clone2.__isDate(parent2)) {
                  child = new Date(parent2.getTime());
                } else if (useBuffer && Buffer.isBuffer(parent2)) {
                  if (Buffer.allocUnsafe) {
                    child = Buffer.allocUnsafe(parent2.length);
                  } else {
                    child = new Buffer(parent2.length);
                  }
                  parent2.copy(child);
                  return child;
                } else if (_instanceof(parent2, Error)) {
                  child = Object.create(parent2);
                } else {
                  if (typeof prototype == "undefined") {
                    proto = Object.getPrototypeOf(parent2);
                    child = Object.create(proto);
                  } else {
                    child = Object.create(prototype);
                    proto = prototype;
                  }
                }
                if (circular) {
                  var index = allParents.indexOf(parent2);
                  if (index != -1) {
                    return allChildren[index];
                  }
                  allParents.push(parent2);
                  allChildren.push(child);
                }
                if (_instanceof(parent2, nativeMap)) {
                  parent2.forEach(function(value, key) {
                    var keyChild = _clone(key, depth2 - 1);
                    var valueChild = _clone(value, depth2 - 1);
                    child.set(keyChild, valueChild);
                  });
                }
                if (_instanceof(parent2, nativeSet)) {
                  parent2.forEach(function(value) {
                    var entryChild = _clone(value, depth2 - 1);
                    child.add(entryChild);
                  });
                }
                for (var i in parent2) {
                  var attrs;
                  if (proto) {
                    attrs = Object.getOwnPropertyDescriptor(proto, i);
                  }
                  if (attrs && attrs.set == null) {
                    continue;
                  }
                  child[i] = _clone(parent2[i], depth2 - 1);
                }
                if (Object.getOwnPropertySymbols) {
                  var symbols = Object.getOwnPropertySymbols(parent2);
                  for (var i = 0; i < symbols.length; i++) {
                    var symbol = symbols[i];
                    var descriptor = Object.getOwnPropertyDescriptor(parent2, symbol);
                    if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
                      continue;
                    }
                    child[symbol] = _clone(parent2[symbol], depth2 - 1);
                    if (!descriptor.enumerable) {
                      Object.defineProperty(child, symbol, {
                        enumerable: false
                      });
                    }
                  }
                }
                if (includeNonEnumerable) {
                  var allPropertyNames = Object.getOwnPropertyNames(parent2);
                  for (var i = 0; i < allPropertyNames.length; i++) {
                    var propertyName = allPropertyNames[i];
                    var descriptor = Object.getOwnPropertyDescriptor(parent2, propertyName);
                    if (descriptor && descriptor.enumerable) {
                      continue;
                    }
                    child[propertyName] = _clone(parent2[propertyName], depth2 - 1);
                    Object.defineProperty(child, propertyName, {
                      enumerable: false
                    });
                  }
                }
                return child;
              }
              return _clone(parent, depth);
            }
            clone2.clonePrototype = function clonePrototype(parent) {
              if (parent === null)
                return null;
              var c = function() {
              };
              c.prototype = parent;
              return new c();
            };
            function __objToStr(o) {
              return Object.prototype.toString.call(o);
            }
            clone2.__objToStr = __objToStr;
            function __isDate(o) {
              return typeof o === "object" && __objToStr(o) === "[object Date]";
            }
            clone2.__isDate = __isDate;
            function __isArray(o) {
              return typeof o === "object" && __objToStr(o) === "[object Array]";
            }
            clone2.__isArray = __isArray;
            function __isRegExp(o) {
              return typeof o === "object" && __objToStr(o) === "[object RegExp]";
            }
            clone2.__isRegExp = __isRegExp;
            function __getRegExpFlags(re) {
              var flags = "";
              if (re.global)
                flags += "g";
              if (re.ignoreCase)
                flags += "i";
              if (re.multiline)
                flags += "m";
              return flags;
            }
            clone2.__getRegExpFlags = __getRegExpFlags;
            return clone2;
          }();
          if (typeof module2 === "object" && module2.exports) {
            module2.exports = clone;
          }
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _slicedToArray = function() {
            function sliceIterator(arr, i) {
              var _arr = [];
              var _n = true;
              var _d = false;
              var _e = void 0;
              try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                  _arr.push(_s.value);
                  if (i && _arr.length === i)
                    break;
                }
              } catch (err) {
                _d = true;
                _e = err;
              } finally {
                try {
                  if (!_n && _i["return"])
                    _i["return"]();
                } finally {
                  if (_d)
                    throw _e;
                }
              }
              return _arr;
            }
            return function(arr, i) {
              if (Array.isArray(arr)) {
                return arr;
              } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
              } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
              }
            };
          }();
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _emitter = __webpack_require__(8);
          var _emitter2 = _interopRequireDefault(_emitter);
          var _block = __webpack_require__(4);
          var _block2 = _interopRequireDefault(_block);
          var _break = __webpack_require__(16);
          var _break2 = _interopRequireDefault(_break);
          var _code = __webpack_require__(13);
          var _code2 = _interopRequireDefault(_code);
          var _container = __webpack_require__(25);
          var _container2 = _interopRequireDefault(_container);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          function isLine(blot) {
            return blot instanceof _block2.default || blot instanceof _block.BlockEmbed;
          }
          var Scroll = function(_Parchment$Scroll) {
            _inherits(Scroll2, _Parchment$Scroll);
            function Scroll2(domNode, config) {
              _classCallCheck(this, Scroll2);
              var _this = _possibleConstructorReturn(this, (Scroll2.__proto__ || Object.getPrototypeOf(Scroll2)).call(this, domNode));
              _this.emitter = config.emitter;
              if (Array.isArray(config.whitelist)) {
                _this.whitelist = config.whitelist.reduce(function(whitelist, format) {
                  whitelist[format] = true;
                  return whitelist;
                }, {});
              }
              _this.domNode.addEventListener("DOMNodeInserted", function() {
              });
              _this.optimize();
              _this.enable();
              return _this;
            }
            _createClass(Scroll2, [{
              key: "batchStart",
              value: function batchStart() {
                this.batch = true;
              }
            }, {
              key: "batchEnd",
              value: function batchEnd() {
                this.batch = false;
                this.optimize();
              }
            }, {
              key: "deleteAt",
              value: function deleteAt(index, length) {
                var _line = this.line(index), _line2 = _slicedToArray(_line, 2), first = _line2[0], offset = _line2[1];
                var _line3 = this.line(index + length), _line4 = _slicedToArray(_line3, 1), last = _line4[0];
                _get(Scroll2.prototype.__proto__ || Object.getPrototypeOf(Scroll2.prototype), "deleteAt", this).call(this, index, length);
                if (last != null && first !== last && offset > 0) {
                  if (first instanceof _block.BlockEmbed || last instanceof _block.BlockEmbed) {
                    this.optimize();
                    return;
                  }
                  if (first instanceof _code2.default) {
                    var newlineIndex = first.newlineIndex(first.length(), true);
                    if (newlineIndex > -1) {
                      first = first.split(newlineIndex + 1);
                      if (first === last) {
                        this.optimize();
                        return;
                      }
                    }
                  } else if (last instanceof _code2.default) {
                    var _newlineIndex = last.newlineIndex(0);
                    if (_newlineIndex > -1) {
                      last.split(_newlineIndex + 1);
                    }
                  }
                  var ref = last.children.head instanceof _break2.default ? null : last.children.head;
                  first.moveChildren(last, ref);
                  first.remove();
                }
                this.optimize();
              }
            }, {
              key: "enable",
              value: function enable() {
                var enabled = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
                this.domNode.setAttribute("contenteditable", enabled);
              }
            }, {
              key: "formatAt",
              value: function formatAt(index, length, format, value) {
                if (this.whitelist != null && !this.whitelist[format])
                  return;
                _get(Scroll2.prototype.__proto__ || Object.getPrototypeOf(Scroll2.prototype), "formatAt", this).call(this, index, length, format, value);
                this.optimize();
              }
            }, {
              key: "insertAt",
              value: function insertAt(index, value, def) {
                if (def != null && this.whitelist != null && !this.whitelist[value])
                  return;
                if (index >= this.length()) {
                  if (def == null || _parchment2.default.query(value, _parchment2.default.Scope.BLOCK) == null) {
                    var blot = _parchment2.default.create(this.statics.defaultChild);
                    this.appendChild(blot);
                    if (def == null && value.endsWith("\n")) {
                      value = value.slice(0, -1);
                    }
                    blot.insertAt(0, value, def);
                  } else {
                    var embed = _parchment2.default.create(value, def);
                    this.appendChild(embed);
                  }
                } else {
                  _get(Scroll2.prototype.__proto__ || Object.getPrototypeOf(Scroll2.prototype), "insertAt", this).call(this, index, value, def);
                }
                this.optimize();
              }
            }, {
              key: "insertBefore",
              value: function insertBefore(blot, ref) {
                if (blot.statics.scope === _parchment2.default.Scope.INLINE_BLOT) {
                  var wrapper = _parchment2.default.create(this.statics.defaultChild);
                  wrapper.appendChild(blot);
                  blot = wrapper;
                }
                _get(Scroll2.prototype.__proto__ || Object.getPrototypeOf(Scroll2.prototype), "insertBefore", this).call(this, blot, ref);
              }
            }, {
              key: "leaf",
              value: function leaf(index) {
                return this.path(index).pop() || [null, -1];
              }
            }, {
              key: "line",
              value: function line(index) {
                if (index === this.length()) {
                  return this.line(index - 1);
                }
                return this.descendant(isLine, index);
              }
            }, {
              key: "lines",
              value: function lines() {
                var index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
                var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
                var getLines = function getLines2(blot, index2, length2) {
                  var lines2 = [], lengthLeft = length2;
                  blot.children.forEachAt(index2, length2, function(child, index3, length3) {
                    if (isLine(child)) {
                      lines2.push(child);
                    } else if (child instanceof _parchment2.default.Container) {
                      lines2 = lines2.concat(getLines2(child, index3, lengthLeft));
                    }
                    lengthLeft -= length3;
                  });
                  return lines2;
                };
                return getLines(this, index, length);
              }
            }, {
              key: "optimize",
              value: function optimize() {
                var mutations = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
                var context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
                if (this.batch === true)
                  return;
                _get(Scroll2.prototype.__proto__ || Object.getPrototypeOf(Scroll2.prototype), "optimize", this).call(this, mutations, context);
                if (mutations.length > 0) {
                  this.emitter.emit(_emitter2.default.events.SCROLL_OPTIMIZE, mutations, context);
                }
              }
            }, {
              key: "path",
              value: function path(index) {
                return _get(Scroll2.prototype.__proto__ || Object.getPrototypeOf(Scroll2.prototype), "path", this).call(this, index).slice(1);
              }
            }, {
              key: "update",
              value: function update(mutations) {
                if (this.batch === true)
                  return;
                var source = _emitter2.default.sources.USER;
                if (typeof mutations === "string") {
                  source = mutations;
                }
                if (!Array.isArray(mutations)) {
                  mutations = this.observer.takeRecords();
                }
                if (mutations.length > 0) {
                  this.emitter.emit(_emitter2.default.events.SCROLL_BEFORE_UPDATE, source, mutations);
                }
                _get(Scroll2.prototype.__proto__ || Object.getPrototypeOf(Scroll2.prototype), "update", this).call(this, mutations.concat([]));
                if (mutations.length > 0) {
                  this.emitter.emit(_emitter2.default.events.SCROLL_UPDATE, source, mutations);
                }
              }
            }]);
            return Scroll2;
          }(_parchment2.default.Scroll);
          Scroll.blotName = "scroll";
          Scroll.className = "ql-editor";
          Scroll.tagName = "DIV";
          Scroll.defaultChild = "block";
          Scroll.allowedChildren = [_block2.default, _block.BlockEmbed, _container2.default];
          exports2.default = Scroll;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.SHORTKEY = exports2.default = void 0;
          var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
          } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
          var _slicedToArray = function() {
            function sliceIterator(arr, i) {
              var _arr = [];
              var _n = true;
              var _d = false;
              var _e = void 0;
              try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                  _arr.push(_s.value);
                  if (i && _arr.length === i)
                    break;
                }
              } catch (err) {
                _d = true;
                _e = err;
              } finally {
                try {
                  if (!_n && _i["return"])
                    _i["return"]();
                } finally {
                  if (_d)
                    throw _e;
                }
              }
              return _arr;
            }
            return function(arr, i) {
              if (Array.isArray(arr)) {
                return arr;
              } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
              } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
              }
            };
          }();
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _clone = __webpack_require__(21);
          var _clone2 = _interopRequireDefault(_clone);
          var _deepEqual = __webpack_require__(11);
          var _deepEqual2 = _interopRequireDefault(_deepEqual);
          var _extend = __webpack_require__(3);
          var _extend2 = _interopRequireDefault(_extend);
          var _quillDelta = __webpack_require__(2);
          var _quillDelta2 = _interopRequireDefault(_quillDelta);
          var _op = __webpack_require__(20);
          var _op2 = _interopRequireDefault(_op);
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _quill = __webpack_require__(5);
          var _quill2 = _interopRequireDefault(_quill);
          var _logger = __webpack_require__(10);
          var _logger2 = _interopRequireDefault(_logger);
          var _module = __webpack_require__(9);
          var _module2 = _interopRequireDefault(_module);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _defineProperty(obj, key, value) {
            if (key in obj) {
              Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
            } else {
              obj[key] = value;
            }
            return obj;
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var debug = (0, _logger2.default)("quill:keyboard");
          var SHORTKEY = /Mac/i.test(navigator.platform) ? "metaKey" : "ctrlKey";
          var Keyboard = function(_Module) {
            _inherits(Keyboard2, _Module);
            _createClass(Keyboard2, null, [{
              key: "match",
              value: function match(evt, binding) {
                binding = normalize(binding);
                if (["altKey", "ctrlKey", "metaKey", "shiftKey"].some(function(key) {
                  return !!binding[key] !== evt[key] && binding[key] !== null;
                })) {
                  return false;
                }
                return binding.key === (evt.which || evt.keyCode);
              }
            }]);
            function Keyboard2(quill, options) {
              _classCallCheck(this, Keyboard2);
              var _this = _possibleConstructorReturn(this, (Keyboard2.__proto__ || Object.getPrototypeOf(Keyboard2)).call(this, quill, options));
              _this.bindings = {};
              Object.keys(_this.options.bindings).forEach(function(name) {
                if (name === "list autofill" && quill.scroll.whitelist != null && !quill.scroll.whitelist["list"]) {
                  return;
                }
                if (_this.options.bindings[name]) {
                  _this.addBinding(_this.options.bindings[name]);
                }
              });
              _this.addBinding({ key: Keyboard2.keys.ENTER, shiftKey: null }, handleEnter);
              _this.addBinding({ key: Keyboard2.keys.ENTER, metaKey: null, ctrlKey: null, altKey: null }, function() {
              });
              if (/Firefox/i.test(navigator.userAgent)) {
                _this.addBinding({ key: Keyboard2.keys.BACKSPACE }, { collapsed: true }, handleBackspace);
                _this.addBinding({ key: Keyboard2.keys.DELETE }, { collapsed: true }, handleDelete);
              } else {
                _this.addBinding({ key: Keyboard2.keys.BACKSPACE }, { collapsed: true, prefix: /^.?$/ }, handleBackspace);
                _this.addBinding({ key: Keyboard2.keys.DELETE }, { collapsed: true, suffix: /^.?$/ }, handleDelete);
              }
              _this.addBinding({ key: Keyboard2.keys.BACKSPACE }, { collapsed: false }, handleDeleteRange);
              _this.addBinding({ key: Keyboard2.keys.DELETE }, { collapsed: false }, handleDeleteRange);
              _this.addBinding({ key: Keyboard2.keys.BACKSPACE, altKey: null, ctrlKey: null, metaKey: null, shiftKey: null }, { collapsed: true, offset: 0 }, handleBackspace);
              _this.listen();
              return _this;
            }
            _createClass(Keyboard2, [{
              key: "addBinding",
              value: function addBinding(key) {
                var context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
                var handler = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                var binding = normalize(key);
                if (binding == null || binding.key == null) {
                  return debug.warn("Attempted to add invalid keyboard binding", binding);
                }
                if (typeof context === "function") {
                  context = { handler: context };
                }
                if (typeof handler === "function") {
                  handler = { handler };
                }
                binding = (0, _extend2.default)(binding, context, handler);
                this.bindings[binding.key] = this.bindings[binding.key] || [];
                this.bindings[binding.key].push(binding);
              }
            }, {
              key: "listen",
              value: function listen() {
                var _this2 = this;
                this.quill.root.addEventListener("keydown", function(evt) {
                  if (evt.defaultPrevented)
                    return;
                  var which = evt.which || evt.keyCode;
                  var bindings = (_this2.bindings[which] || []).filter(function(binding) {
                    return Keyboard2.match(evt, binding);
                  });
                  if (bindings.length === 0)
                    return;
                  var range = _this2.quill.getSelection();
                  if (range == null || !_this2.quill.hasFocus())
                    return;
                  var _quill$getLine = _this2.quill.getLine(range.index), _quill$getLine2 = _slicedToArray(_quill$getLine, 2), line = _quill$getLine2[0], offset = _quill$getLine2[1];
                  var _quill$getLeaf = _this2.quill.getLeaf(range.index), _quill$getLeaf2 = _slicedToArray(_quill$getLeaf, 2), leafStart = _quill$getLeaf2[0], offsetStart = _quill$getLeaf2[1];
                  var _ref = range.length === 0 ? [leafStart, offsetStart] : _this2.quill.getLeaf(range.index + range.length), _ref2 = _slicedToArray(_ref, 2), leafEnd = _ref2[0], offsetEnd = _ref2[1];
                  var prefixText = leafStart instanceof _parchment2.default.Text ? leafStart.value().slice(0, offsetStart) : "";
                  var suffixText = leafEnd instanceof _parchment2.default.Text ? leafEnd.value().slice(offsetEnd) : "";
                  var curContext = {
                    collapsed: range.length === 0,
                    empty: range.length === 0 && line.length() <= 1,
                    format: _this2.quill.getFormat(range),
                    offset,
                    prefix: prefixText,
                    suffix: suffixText
                  };
                  var prevented = bindings.some(function(binding) {
                    if (binding.collapsed != null && binding.collapsed !== curContext.collapsed)
                      return false;
                    if (binding.empty != null && binding.empty !== curContext.empty)
                      return false;
                    if (binding.offset != null && binding.offset !== curContext.offset)
                      return false;
                    if (Array.isArray(binding.format)) {
                      if (binding.format.every(function(name) {
                        return curContext.format[name] == null;
                      })) {
                        return false;
                      }
                    } else if (_typeof(binding.format) === "object") {
                      if (!Object.keys(binding.format).every(function(name) {
                        if (binding.format[name] === true)
                          return curContext.format[name] != null;
                        if (binding.format[name] === false)
                          return curContext.format[name] == null;
                        return (0, _deepEqual2.default)(binding.format[name], curContext.format[name]);
                      })) {
                        return false;
                      }
                    }
                    if (binding.prefix != null && !binding.prefix.test(curContext.prefix))
                      return false;
                    if (binding.suffix != null && !binding.suffix.test(curContext.suffix))
                      return false;
                    return binding.handler.call(_this2, range, curContext) !== true;
                  });
                  if (prevented) {
                    evt.preventDefault();
                  }
                });
              }
            }]);
            return Keyboard2;
          }(_module2.default);
          Keyboard.keys = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            ESCAPE: 27,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            DELETE: 46
          };
          Keyboard.DEFAULTS = {
            bindings: {
              "bold": makeFormatHandler("bold"),
              "italic": makeFormatHandler("italic"),
              "underline": makeFormatHandler("underline"),
              "indent": {
                key: Keyboard.keys.TAB,
                format: ["blockquote", "indent", "list"],
                handler: function handler(range, context) {
                  if (context.collapsed && context.offset !== 0)
                    return true;
                  this.quill.format("indent", "+1", _quill2.default.sources.USER);
                }
              },
              "outdent": {
                key: Keyboard.keys.TAB,
                shiftKey: true,
                format: ["blockquote", "indent", "list"],
                handler: function handler(range, context) {
                  if (context.collapsed && context.offset !== 0)
                    return true;
                  this.quill.format("indent", "-1", _quill2.default.sources.USER);
                }
              },
              "outdent backspace": {
                key: Keyboard.keys.BACKSPACE,
                collapsed: true,
                shiftKey: null,
                metaKey: null,
                ctrlKey: null,
                altKey: null,
                format: ["indent", "list"],
                offset: 0,
                handler: function handler(range, context) {
                  if (context.format.indent != null) {
                    this.quill.format("indent", "-1", _quill2.default.sources.USER);
                  } else if (context.format.list != null) {
                    this.quill.format("list", false, _quill2.default.sources.USER);
                  }
                }
              },
              "indent code-block": makeCodeBlockHandler(true),
              "outdent code-block": makeCodeBlockHandler(false),
              "remove tab": {
                key: Keyboard.keys.TAB,
                shiftKey: true,
                collapsed: true,
                prefix: /\t$/,
                handler: function handler(range) {
                  this.quill.deleteText(range.index - 1, 1, _quill2.default.sources.USER);
                }
              },
              "tab": {
                key: Keyboard.keys.TAB,
                handler: function handler(range) {
                  this.quill.history.cutoff();
                  var delta = new _quillDelta2.default().retain(range.index).delete(range.length).insert("	");
                  this.quill.updateContents(delta, _quill2.default.sources.USER);
                  this.quill.history.cutoff();
                  this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
                }
              },
              "list empty enter": {
                key: Keyboard.keys.ENTER,
                collapsed: true,
                format: ["list"],
                empty: true,
                handler: function handler(range, context) {
                  this.quill.format("list", false, _quill2.default.sources.USER);
                  if (context.format.indent) {
                    this.quill.format("indent", false, _quill2.default.sources.USER);
                  }
                }
              },
              "checklist enter": {
                key: Keyboard.keys.ENTER,
                collapsed: true,
                format: { list: "checked" },
                handler: function handler(range) {
                  var _quill$getLine3 = this.quill.getLine(range.index), _quill$getLine4 = _slicedToArray(_quill$getLine3, 2), line = _quill$getLine4[0], offset = _quill$getLine4[1];
                  var formats = (0, _extend2.default)({}, line.formats(), { list: "checked" });
                  var delta = new _quillDelta2.default().retain(range.index).insert("\n", formats).retain(line.length() - offset - 1).retain(1, { list: "unchecked" });
                  this.quill.updateContents(delta, _quill2.default.sources.USER);
                  this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
                  this.quill.scrollIntoView();
                }
              },
              "header enter": {
                key: Keyboard.keys.ENTER,
                collapsed: true,
                format: ["header"],
                suffix: /^$/,
                handler: function handler(range, context) {
                  var _quill$getLine5 = this.quill.getLine(range.index), _quill$getLine6 = _slicedToArray(_quill$getLine5, 2), line = _quill$getLine6[0], offset = _quill$getLine6[1];
                  var delta = new _quillDelta2.default().retain(range.index).insert("\n", context.format).retain(line.length() - offset - 1).retain(1, { header: null });
                  this.quill.updateContents(delta, _quill2.default.sources.USER);
                  this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
                  this.quill.scrollIntoView();
                }
              },
              "list autofill": {
                key: " ",
                collapsed: true,
                format: { list: false },
                prefix: /^\s*?(\d+\.|-|\*|\[ ?\]|\[x\])$/,
                handler: function handler(range, context) {
                  var length = context.prefix.length;
                  var _quill$getLine7 = this.quill.getLine(range.index), _quill$getLine8 = _slicedToArray(_quill$getLine7, 2), line = _quill$getLine8[0], offset = _quill$getLine8[1];
                  if (offset > length)
                    return true;
                  var value = void 0;
                  switch (context.prefix.trim()) {
                    case "[]":
                    case "[ ]":
                      value = "unchecked";
                      break;
                    case "[x]":
                      value = "checked";
                      break;
                    case "-":
                    case "*":
                      value = "bullet";
                      break;
                    default:
                      value = "ordered";
                  }
                  this.quill.insertText(range.index, " ", _quill2.default.sources.USER);
                  this.quill.history.cutoff();
                  var delta = new _quillDelta2.default().retain(range.index - offset).delete(length + 1).retain(line.length() - 2 - offset).retain(1, { list: value });
                  this.quill.updateContents(delta, _quill2.default.sources.USER);
                  this.quill.history.cutoff();
                  this.quill.setSelection(range.index - length, _quill2.default.sources.SILENT);
                }
              },
              "code exit": {
                key: Keyboard.keys.ENTER,
                collapsed: true,
                format: ["code-block"],
                prefix: /\n\n$/,
                suffix: /^\s+$/,
                handler: function handler(range) {
                  var _quill$getLine9 = this.quill.getLine(range.index), _quill$getLine10 = _slicedToArray(_quill$getLine9, 2), line = _quill$getLine10[0], offset = _quill$getLine10[1];
                  var delta = new _quillDelta2.default().retain(range.index + line.length() - offset - 2).retain(1, { "code-block": null }).delete(1);
                  this.quill.updateContents(delta, _quill2.default.sources.USER);
                }
              },
              "embed left": makeEmbedArrowHandler(Keyboard.keys.LEFT, false),
              "embed left shift": makeEmbedArrowHandler(Keyboard.keys.LEFT, true),
              "embed right": makeEmbedArrowHandler(Keyboard.keys.RIGHT, false),
              "embed right shift": makeEmbedArrowHandler(Keyboard.keys.RIGHT, true)
            }
          };
          function makeEmbedArrowHandler(key, shiftKey) {
            var _ref3;
            var where = key === Keyboard.keys.LEFT ? "prefix" : "suffix";
            return _ref3 = {
              key,
              shiftKey,
              altKey: null
            }, _defineProperty(_ref3, where, /^$/), _defineProperty(_ref3, "handler", function handler(range) {
              var index = range.index;
              if (key === Keyboard.keys.RIGHT) {
                index += range.length + 1;
              }
              var _quill$getLeaf3 = this.quill.getLeaf(index), _quill$getLeaf4 = _slicedToArray(_quill$getLeaf3, 1), leaf = _quill$getLeaf4[0];
              if (!(leaf instanceof _parchment2.default.Embed))
                return true;
              if (key === Keyboard.keys.LEFT) {
                if (shiftKey) {
                  this.quill.setSelection(range.index - 1, range.length + 1, _quill2.default.sources.USER);
                } else {
                  this.quill.setSelection(range.index - 1, _quill2.default.sources.USER);
                }
              } else {
                if (shiftKey) {
                  this.quill.setSelection(range.index, range.length + 1, _quill2.default.sources.USER);
                } else {
                  this.quill.setSelection(range.index + range.length + 1, _quill2.default.sources.USER);
                }
              }
              return false;
            }), _ref3;
          }
          function handleBackspace(range, context) {
            if (range.index === 0 || this.quill.getLength() <= 1)
              return;
            var _quill$getLine11 = this.quill.getLine(range.index), _quill$getLine12 = _slicedToArray(_quill$getLine11, 1), line = _quill$getLine12[0];
            var formats = {};
            if (context.offset === 0) {
              var _quill$getLine13 = this.quill.getLine(range.index - 1), _quill$getLine14 = _slicedToArray(_quill$getLine13, 1), prev = _quill$getLine14[0];
              if (prev != null && prev.length() > 1) {
                var curFormats = line.formats();
                var prevFormats = this.quill.getFormat(range.index - 1, 1);
                formats = _op2.default.attributes.diff(curFormats, prevFormats) || {};
              }
            }
            var length = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(context.prefix) ? 2 : 1;
            this.quill.deleteText(range.index - length, length, _quill2.default.sources.USER);
            if (Object.keys(formats).length > 0) {
              this.quill.formatLine(range.index - length, length, formats, _quill2.default.sources.USER);
            }
            this.quill.focus();
          }
          function handleDelete(range, context) {
            var length = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(context.suffix) ? 2 : 1;
            if (range.index >= this.quill.getLength() - length)
              return;
            var formats = {}, nextLength = 0;
            var _quill$getLine15 = this.quill.getLine(range.index), _quill$getLine16 = _slicedToArray(_quill$getLine15, 1), line = _quill$getLine16[0];
            if (context.offset >= line.length() - 1) {
              var _quill$getLine17 = this.quill.getLine(range.index + 1), _quill$getLine18 = _slicedToArray(_quill$getLine17, 1), next = _quill$getLine18[0];
              if (next) {
                var curFormats = line.formats();
                var nextFormats = this.quill.getFormat(range.index, 1);
                formats = _op2.default.attributes.diff(curFormats, nextFormats) || {};
                nextLength = next.length();
              }
            }
            this.quill.deleteText(range.index, length, _quill2.default.sources.USER);
            if (Object.keys(formats).length > 0) {
              this.quill.formatLine(range.index + nextLength - 1, length, formats, _quill2.default.sources.USER);
            }
          }
          function handleDeleteRange(range) {
            var lines = this.quill.getLines(range);
            var formats = {};
            if (lines.length > 1) {
              var firstFormats = lines[0].formats();
              var lastFormats = lines[lines.length - 1].formats();
              formats = _op2.default.attributes.diff(lastFormats, firstFormats) || {};
            }
            this.quill.deleteText(range, _quill2.default.sources.USER);
            if (Object.keys(formats).length > 0) {
              this.quill.formatLine(range.index, 1, formats, _quill2.default.sources.USER);
            }
            this.quill.setSelection(range.index, _quill2.default.sources.SILENT);
            this.quill.focus();
          }
          function handleEnter(range, context) {
            var _this3 = this;
            if (range.length > 0) {
              this.quill.scroll.deleteAt(range.index, range.length);
            }
            var lineFormats = Object.keys(context.format).reduce(function(lineFormats2, format) {
              if (_parchment2.default.query(format, _parchment2.default.Scope.BLOCK) && !Array.isArray(context.format[format])) {
                lineFormats2[format] = context.format[format];
              }
              return lineFormats2;
            }, {});
            this.quill.insertText(range.index, "\n", lineFormats, _quill2.default.sources.USER);
            this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
            this.quill.focus();
            Object.keys(context.format).forEach(function(name) {
              if (lineFormats[name] != null)
                return;
              if (Array.isArray(context.format[name]))
                return;
              if (name === "link")
                return;
              _this3.quill.format(name, context.format[name], _quill2.default.sources.USER);
            });
          }
          function makeCodeBlockHandler(indent) {
            return {
              key: Keyboard.keys.TAB,
              shiftKey: !indent,
              format: { "code-block": true },
              handler: function handler(range) {
                var CodeBlock = _parchment2.default.query("code-block");
                var index = range.index, length = range.length;
                var _quill$scroll$descend = this.quill.scroll.descendant(CodeBlock, index), _quill$scroll$descend2 = _slicedToArray(_quill$scroll$descend, 2), block = _quill$scroll$descend2[0], offset = _quill$scroll$descend2[1];
                if (block == null)
                  return;
                var scrollIndex = this.quill.getIndex(block);
                var start = block.newlineIndex(offset, true) + 1;
                var end = block.newlineIndex(scrollIndex + offset + length);
                var lines = block.domNode.textContent.slice(start, end).split("\n");
                offset = 0;
                lines.forEach(function(line, i) {
                  if (indent) {
                    block.insertAt(start + offset, CodeBlock.TAB);
                    offset += CodeBlock.TAB.length;
                    if (i === 0) {
                      index += CodeBlock.TAB.length;
                    } else {
                      length += CodeBlock.TAB.length;
                    }
                  } else if (line.startsWith(CodeBlock.TAB)) {
                    block.deleteAt(start + offset, CodeBlock.TAB.length);
                    offset -= CodeBlock.TAB.length;
                    if (i === 0) {
                      index -= CodeBlock.TAB.length;
                    } else {
                      length -= CodeBlock.TAB.length;
                    }
                  }
                  offset += line.length + 1;
                });
                this.quill.update(_quill2.default.sources.USER);
                this.quill.setSelection(index, length, _quill2.default.sources.SILENT);
              }
            };
          }
          function makeFormatHandler(format) {
            return {
              key: format[0].toUpperCase(),
              shortKey: true,
              handler: function handler(range, context) {
                this.quill.format(format, !context.format[format], _quill2.default.sources.USER);
              }
            };
          }
          function normalize(binding) {
            if (typeof binding === "string" || typeof binding === "number") {
              return normalize({ key: binding });
            }
            if ((typeof binding === "undefined" ? "undefined" : _typeof(binding)) === "object") {
              binding = (0, _clone2.default)(binding, false);
            }
            if (typeof binding.key === "string") {
              if (Keyboard.keys[binding.key.toUpperCase()] != null) {
                binding.key = Keyboard.keys[binding.key.toUpperCase()];
              } else if (binding.key.length === 1) {
                binding.key = binding.key.toUpperCase().charCodeAt(0);
              } else {
                return null;
              }
            }
            if (binding.shortKey) {
              binding[SHORTKEY] = binding.shortKey;
              delete binding.shortKey;
            }
            return binding;
          }
          exports2.default = Keyboard;
          exports2.SHORTKEY = SHORTKEY;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _slicedToArray = function() {
            function sliceIterator(arr, i) {
              var _arr = [];
              var _n = true;
              var _d = false;
              var _e = void 0;
              try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                  _arr.push(_s.value);
                  if (i && _arr.length === i)
                    break;
                }
              } catch (err) {
                _d = true;
                _e = err;
              } finally {
                try {
                  if (!_n && _i["return"])
                    _i["return"]();
                } finally {
                  if (_d)
                    throw _e;
                }
              }
              return _arr;
            }
            return function(arr, i) {
              if (Array.isArray(arr)) {
                return arr;
              } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
              } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
              }
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _text = __webpack_require__(7);
          var _text2 = _interopRequireDefault(_text);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var Cursor = function(_Parchment$Embed) {
            _inherits(Cursor2, _Parchment$Embed);
            _createClass(Cursor2, null, [{
              key: "value",
              value: function value() {
                return void 0;
              }
            }]);
            function Cursor2(domNode, selection) {
              _classCallCheck(this, Cursor2);
              var _this = _possibleConstructorReturn(this, (Cursor2.__proto__ || Object.getPrototypeOf(Cursor2)).call(this, domNode));
              _this.selection = selection;
              _this.textNode = document.createTextNode(Cursor2.CONTENTS);
              _this.domNode.appendChild(_this.textNode);
              _this._length = 0;
              return _this;
            }
            _createClass(Cursor2, [{
              key: "detach",
              value: function detach() {
                if (this.parent != null)
                  this.parent.removeChild(this);
              }
            }, {
              key: "format",
              value: function format(name, value) {
                if (this._length !== 0) {
                  return _get(Cursor2.prototype.__proto__ || Object.getPrototypeOf(Cursor2.prototype), "format", this).call(this, name, value);
                }
                var target = this, index = 0;
                while (target != null && target.statics.scope !== _parchment2.default.Scope.BLOCK_BLOT) {
                  index += target.offset(target.parent);
                  target = target.parent;
                }
                if (target != null) {
                  this._length = Cursor2.CONTENTS.length;
                  target.optimize();
                  target.formatAt(index, Cursor2.CONTENTS.length, name, value);
                  this._length = 0;
                }
              }
            }, {
              key: "index",
              value: function index(node, offset) {
                if (node === this.textNode)
                  return 0;
                return _get(Cursor2.prototype.__proto__ || Object.getPrototypeOf(Cursor2.prototype), "index", this).call(this, node, offset);
              }
            }, {
              key: "length",
              value: function length() {
                return this._length;
              }
            }, {
              key: "position",
              value: function position() {
                return [this.textNode, this.textNode.data.length];
              }
            }, {
              key: "remove",
              value: function remove() {
                _get(Cursor2.prototype.__proto__ || Object.getPrototypeOf(Cursor2.prototype), "remove", this).call(this);
                this.parent = null;
              }
            }, {
              key: "restore",
              value: function restore() {
                if (this.selection.composing || this.parent == null)
                  return;
                var textNode = this.textNode;
                var range = this.selection.getNativeRange();
                var restoreText = void 0, start = void 0, end = void 0;
                if (range != null && range.start.node === textNode && range.end.node === textNode) {
                  var _ref = [textNode, range.start.offset, range.end.offset];
                  restoreText = _ref[0];
                  start = _ref[1];
                  end = _ref[2];
                }
                while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
                  this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
                }
                if (this.textNode.data !== Cursor2.CONTENTS) {
                  var text = this.textNode.data.split(Cursor2.CONTENTS).join("");
                  if (this.next instanceof _text2.default) {
                    restoreText = this.next.domNode;
                    this.next.insertAt(0, text);
                    this.textNode.data = Cursor2.CONTENTS;
                  } else {
                    this.textNode.data = text;
                    this.parent.insertBefore(_parchment2.default.create(this.textNode), this);
                    this.textNode = document.createTextNode(Cursor2.CONTENTS);
                    this.domNode.appendChild(this.textNode);
                  }
                }
                this.remove();
                if (start != null) {
                  var _map = [start, end].map(function(offset) {
                    return Math.max(0, Math.min(restoreText.data.length, offset - 1));
                  });
                  var _map2 = _slicedToArray(_map, 2);
                  start = _map2[0];
                  end = _map2[1];
                  return {
                    startNode: restoreText,
                    startOffset: start,
                    endNode: restoreText,
                    endOffset: end
                  };
                }
              }
            }, {
              key: "update",
              value: function update(mutations, context) {
                var _this2 = this;
                if (mutations.some(function(mutation) {
                  return mutation.type === "characterData" && mutation.target === _this2.textNode;
                })) {
                  var range = this.restore();
                  if (range)
                    context.range = range;
                }
              }
            }, {
              key: "value",
              value: function value() {
                return "";
              }
            }]);
            return Cursor2;
          }(_parchment2.default.Embed);
          Cursor.blotName = "cursor";
          Cursor.className = "ql-cursor";
          Cursor.tagName = "span";
          Cursor.CONTENTS = "\uFEFF";
          exports2.default = Cursor;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _block = __webpack_require__(4);
          var _block2 = _interopRequireDefault(_block);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var Container = function(_Parchment$Container) {
            _inherits(Container2, _Parchment$Container);
            function Container2() {
              _classCallCheck(this, Container2);
              return _possibleConstructorReturn(this, (Container2.__proto__ || Object.getPrototypeOf(Container2)).apply(this, arguments));
            }
            return Container2;
          }(_parchment2.default.Container);
          Container.allowedChildren = [_block2.default, _block.BlockEmbed, Container];
          exports2.default = Container;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.ColorStyle = exports2.ColorClass = exports2.ColorAttributor = void 0;
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var ColorAttributor = function(_Parchment$Attributor) {
            _inherits(ColorAttributor2, _Parchment$Attributor);
            function ColorAttributor2() {
              _classCallCheck(this, ColorAttributor2);
              return _possibleConstructorReturn(this, (ColorAttributor2.__proto__ || Object.getPrototypeOf(ColorAttributor2)).apply(this, arguments));
            }
            _createClass(ColorAttributor2, [{
              key: "value",
              value: function value(domNode) {
                var value2 = _get(ColorAttributor2.prototype.__proto__ || Object.getPrototypeOf(ColorAttributor2.prototype), "value", this).call(this, domNode);
                if (!value2.startsWith("rgb("))
                  return value2;
                value2 = value2.replace(/^[^\d]+/, "").replace(/[^\d]+$/, "");
                return "#" + value2.split(",").map(function(component) {
                  return ("00" + parseInt(component).toString(16)).slice(-2);
                }).join("");
              }
            }]);
            return ColorAttributor2;
          }(_parchment2.default.Attributor.Style);
          var ColorClass = new _parchment2.default.Attributor.Class("color", "ql-color", {
            scope: _parchment2.default.Scope.INLINE
          });
          var ColorStyle = new ColorAttributor("color", "color", {
            scope: _parchment2.default.Scope.INLINE
          });
          exports2.ColorAttributor = ColorAttributor;
          exports2.ColorClass = ColorClass;
          exports2.ColorStyle = ColorStyle;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.sanitize = exports2.default = void 0;
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _inline = __webpack_require__(6);
          var _inline2 = _interopRequireDefault(_inline);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var Link = function(_Inline) {
            _inherits(Link2, _Inline);
            function Link2() {
              _classCallCheck(this, Link2);
              return _possibleConstructorReturn(this, (Link2.__proto__ || Object.getPrototypeOf(Link2)).apply(this, arguments));
            }
            _createClass(Link2, [{
              key: "format",
              value: function format(name, value) {
                if (name !== this.statics.blotName || !value)
                  return _get(Link2.prototype.__proto__ || Object.getPrototypeOf(Link2.prototype), "format", this).call(this, name, value);
                value = this.constructor.sanitize(value);
                this.domNode.setAttribute("href", value);
              }
            }], [{
              key: "create",
              value: function create(value) {
                var node = _get(Link2.__proto__ || Object.getPrototypeOf(Link2), "create", this).call(this, value);
                value = this.sanitize(value);
                node.setAttribute("href", value);
                node.setAttribute("rel", "noopener noreferrer");
                node.setAttribute("target", "_blank");
                return node;
              }
            }, {
              key: "formats",
              value: function formats(domNode) {
                return domNode.getAttribute("href");
              }
            }, {
              key: "sanitize",
              value: function sanitize(url) {
                return _sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
              }
            }]);
            return Link2;
          }(_inline2.default);
          Link.blotName = "link";
          Link.tagName = "A";
          Link.SANITIZED_URL = "about:blank";
          Link.PROTOCOL_WHITELIST = ["http", "https", "mailto", "tel"];
          function _sanitize(url, protocols) {
            var anchor = document.createElement("a");
            anchor.href = url;
            var protocol = anchor.href.slice(0, anchor.href.indexOf(":"));
            return protocols.indexOf(protocol) > -1;
          }
          exports2.default = Link;
          exports2.sanitize = _sanitize;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
          } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _keyboard = __webpack_require__(23);
          var _keyboard2 = _interopRequireDefault(_keyboard);
          var _dropdown = __webpack_require__(107);
          var _dropdown2 = _interopRequireDefault(_dropdown);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          var optionsCounter = 0;
          function toggleAriaAttribute(element, attribute) {
            element.setAttribute(attribute, !(element.getAttribute(attribute) === "true"));
          }
          var Picker = function() {
            function Picker2(select) {
              var _this = this;
              _classCallCheck(this, Picker2);
              this.select = select;
              this.container = document.createElement("span");
              this.buildPicker();
              this.select.style.display = "none";
              this.select.parentNode.insertBefore(this.container, this.select);
              this.label.addEventListener("mousedown", function() {
                _this.togglePicker();
              });
              this.label.addEventListener("keydown", function(event) {
                switch (event.keyCode) {
                  case _keyboard2.default.keys.ENTER:
                    _this.togglePicker();
                    break;
                  case _keyboard2.default.keys.ESCAPE:
                    _this.escape();
                    event.preventDefault();
                    break;
                  default:
                }
              });
              this.select.addEventListener("change", this.update.bind(this));
            }
            _createClass(Picker2, [{
              key: "togglePicker",
              value: function togglePicker() {
                this.container.classList.toggle("ql-expanded");
                toggleAriaAttribute(this.label, "aria-expanded");
                toggleAriaAttribute(this.options, "aria-hidden");
              }
            }, {
              key: "buildItem",
              value: function buildItem(option) {
                var _this2 = this;
                var item = document.createElement("span");
                item.tabIndex = "0";
                item.setAttribute("role", "button");
                item.classList.add("ql-picker-item");
                if (option.hasAttribute("value")) {
                  item.setAttribute("data-value", option.getAttribute("value"));
                }
                if (option.textContent) {
                  item.setAttribute("data-label", option.textContent);
                }
                item.addEventListener("click", function() {
                  _this2.selectItem(item, true);
                });
                item.addEventListener("keydown", function(event) {
                  switch (event.keyCode) {
                    case _keyboard2.default.keys.ENTER:
                      _this2.selectItem(item, true);
                      event.preventDefault();
                      break;
                    case _keyboard2.default.keys.ESCAPE:
                      _this2.escape();
                      event.preventDefault();
                      break;
                    default:
                  }
                });
                return item;
              }
            }, {
              key: "buildLabel",
              value: function buildLabel() {
                var label = document.createElement("span");
                label.classList.add("ql-picker-label");
                label.innerHTML = _dropdown2.default;
                label.tabIndex = "0";
                label.setAttribute("role", "button");
                label.setAttribute("aria-expanded", "false");
                this.container.appendChild(label);
                return label;
              }
            }, {
              key: "buildOptions",
              value: function buildOptions() {
                var _this3 = this;
                var options = document.createElement("span");
                options.classList.add("ql-picker-options");
                options.setAttribute("aria-hidden", "true");
                options.tabIndex = "-1";
                options.id = "ql-picker-options-" + optionsCounter;
                optionsCounter += 1;
                this.label.setAttribute("aria-controls", options.id);
                this.options = options;
                [].slice.call(this.select.options).forEach(function(option) {
                  var item = _this3.buildItem(option);
                  options.appendChild(item);
                  if (option.selected === true) {
                    _this3.selectItem(item);
                  }
                });
                this.container.appendChild(options);
              }
            }, {
              key: "buildPicker",
              value: function buildPicker() {
                var _this4 = this;
                [].slice.call(this.select.attributes).forEach(function(item) {
                  _this4.container.setAttribute(item.name, item.value);
                });
                this.container.classList.add("ql-picker");
                this.label = this.buildLabel();
                this.buildOptions();
              }
            }, {
              key: "escape",
              value: function escape() {
                var _this5 = this;
                this.close();
                setTimeout(function() {
                  return _this5.label.focus();
                }, 1);
              }
            }, {
              key: "close",
              value: function close() {
                this.container.classList.remove("ql-expanded");
                this.label.setAttribute("aria-expanded", "false");
                this.options.setAttribute("aria-hidden", "true");
              }
            }, {
              key: "selectItem",
              value: function selectItem(item) {
                var trigger = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                var selected = this.container.querySelector(".ql-selected");
                if (item === selected)
                  return;
                if (selected != null) {
                  selected.classList.remove("ql-selected");
                }
                if (item == null)
                  return;
                item.classList.add("ql-selected");
                this.select.selectedIndex = [].indexOf.call(item.parentNode.children, item);
                if (item.hasAttribute("data-value")) {
                  this.label.setAttribute("data-value", item.getAttribute("data-value"));
                } else {
                  this.label.removeAttribute("data-value");
                }
                if (item.hasAttribute("data-label")) {
                  this.label.setAttribute("data-label", item.getAttribute("data-label"));
                } else {
                  this.label.removeAttribute("data-label");
                }
                if (trigger) {
                  if (typeof Event === "function") {
                    this.select.dispatchEvent(new Event("change"));
                  } else if ((typeof Event === "undefined" ? "undefined" : _typeof(Event)) === "object") {
                    var event = document.createEvent("Event");
                    event.initEvent("change", true, true);
                    this.select.dispatchEvent(event);
                  }
                  this.close();
                }
              }
            }, {
              key: "update",
              value: function update() {
                var option = void 0;
                if (this.select.selectedIndex > -1) {
                  var item = this.container.querySelector(".ql-picker-options").children[this.select.selectedIndex];
                  option = this.select.options[this.select.selectedIndex];
                  this.selectItem(item);
                } else {
                  this.selectItem(null);
                }
                var isActive = option != null && option !== this.select.querySelector("option[selected]");
                this.label.classList.toggle("ql-active", isActive);
              }
            }]);
            return Picker2;
          }();
          exports2.default = Picker;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _quill = __webpack_require__(5);
          var _quill2 = _interopRequireDefault(_quill);
          var _block = __webpack_require__(4);
          var _block2 = _interopRequireDefault(_block);
          var _break = __webpack_require__(16);
          var _break2 = _interopRequireDefault(_break);
          var _container = __webpack_require__(25);
          var _container2 = _interopRequireDefault(_container);
          var _cursor = __webpack_require__(24);
          var _cursor2 = _interopRequireDefault(_cursor);
          var _embed = __webpack_require__(35);
          var _embed2 = _interopRequireDefault(_embed);
          var _inline = __webpack_require__(6);
          var _inline2 = _interopRequireDefault(_inline);
          var _scroll = __webpack_require__(22);
          var _scroll2 = _interopRequireDefault(_scroll);
          var _text = __webpack_require__(7);
          var _text2 = _interopRequireDefault(_text);
          var _clipboard = __webpack_require__(55);
          var _clipboard2 = _interopRequireDefault(_clipboard);
          var _history = __webpack_require__(42);
          var _history2 = _interopRequireDefault(_history);
          var _keyboard = __webpack_require__(23);
          var _keyboard2 = _interopRequireDefault(_keyboard);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          _quill2.default.register({
            "blots/block": _block2.default,
            "blots/block/embed": _block.BlockEmbed,
            "blots/break": _break2.default,
            "blots/container": _container2.default,
            "blots/cursor": _cursor2.default,
            "blots/embed": _embed2.default,
            "blots/inline": _inline2.default,
            "blots/scroll": _scroll2.default,
            "blots/text": _text2.default,
            "modules/clipboard": _clipboard2.default,
            "modules/history": _history2.default,
            "modules/keyboard": _keyboard2.default
          });
          _parchment2.default.register(_block2.default, _break2.default, _cursor2.default, _inline2.default, _scroll2.default, _text2.default);
          exports2.default = _quill2.default;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", { value: true });
          var Registry = __webpack_require__(1);
          var ShadowBlot = function() {
            function ShadowBlot2(domNode) {
              this.domNode = domNode;
              this.domNode[Registry.DATA_KEY] = { blot: this };
            }
            Object.defineProperty(ShadowBlot2.prototype, "statics", {
              get: function() {
                return this.constructor;
              },
              enumerable: true,
              configurable: true
            });
            ShadowBlot2.create = function(value) {
              if (this.tagName == null) {
                throw new Registry.ParchmentError("Blot definition missing tagName");
              }
              var node;
              if (Array.isArray(this.tagName)) {
                if (typeof value === "string") {
                  value = value.toUpperCase();
                  if (parseInt(value).toString() === value) {
                    value = parseInt(value);
                  }
                }
                if (typeof value === "number") {
                  node = document.createElement(this.tagName[value - 1]);
                } else if (this.tagName.indexOf(value) > -1) {
                  node = document.createElement(value);
                } else {
                  node = document.createElement(this.tagName[0]);
                }
              } else {
                node = document.createElement(this.tagName);
              }
              if (this.className) {
                node.classList.add(this.className);
              }
              return node;
            };
            ShadowBlot2.prototype.attach = function() {
              if (this.parent != null) {
                this.scroll = this.parent.scroll;
              }
            };
            ShadowBlot2.prototype.clone = function() {
              var domNode = this.domNode.cloneNode(false);
              return Registry.create(domNode);
            };
            ShadowBlot2.prototype.detach = function() {
              if (this.parent != null)
                this.parent.removeChild(this);
              delete this.domNode[Registry.DATA_KEY];
            };
            ShadowBlot2.prototype.deleteAt = function(index, length) {
              var blot = this.isolate(index, length);
              blot.remove();
            };
            ShadowBlot2.prototype.formatAt = function(index, length, name, value) {
              var blot = this.isolate(index, length);
              if (Registry.query(name, Registry.Scope.BLOT) != null && value) {
                blot.wrap(name, value);
              } else if (Registry.query(name, Registry.Scope.ATTRIBUTE) != null) {
                var parent = Registry.create(this.statics.scope);
                blot.wrap(parent);
                parent.format(name, value);
              }
            };
            ShadowBlot2.prototype.insertAt = function(index, value, def) {
              var blot = def == null ? Registry.create("text", value) : Registry.create(value, def);
              var ref = this.split(index);
              this.parent.insertBefore(blot, ref);
            };
            ShadowBlot2.prototype.insertInto = function(parentBlot, refBlot) {
              if (refBlot === void 0) {
                refBlot = null;
              }
              if (this.parent != null) {
                this.parent.children.remove(this);
              }
              var refDomNode = null;
              parentBlot.children.insertBefore(this, refBlot);
              if (refBlot != null) {
                refDomNode = refBlot.domNode;
              }
              if (this.domNode.parentNode != parentBlot.domNode || this.domNode.nextSibling != refDomNode) {
                parentBlot.domNode.insertBefore(this.domNode, refDomNode);
              }
              this.parent = parentBlot;
              this.attach();
            };
            ShadowBlot2.prototype.isolate = function(index, length) {
              var target = this.split(index);
              target.split(length);
              return target;
            };
            ShadowBlot2.prototype.length = function() {
              return 1;
            };
            ShadowBlot2.prototype.offset = function(root) {
              if (root === void 0) {
                root = this.parent;
              }
              if (this.parent == null || this == root)
                return 0;
              return this.parent.children.offset(this) + this.parent.offset(root);
            };
            ShadowBlot2.prototype.optimize = function(context) {
              if (this.domNode[Registry.DATA_KEY] != null) {
                delete this.domNode[Registry.DATA_KEY].mutations;
              }
            };
            ShadowBlot2.prototype.remove = function() {
              if (this.domNode.parentNode != null) {
                this.domNode.parentNode.removeChild(this.domNode);
              }
              this.detach();
            };
            ShadowBlot2.prototype.replace = function(target) {
              if (target.parent == null)
                return;
              target.parent.insertBefore(this, target.next);
              target.remove();
            };
            ShadowBlot2.prototype.replaceWith = function(name, value) {
              var replacement = typeof name === "string" ? Registry.create(name, value) : name;
              replacement.replace(this);
              return replacement;
            };
            ShadowBlot2.prototype.split = function(index, force) {
              return index === 0 ? this : this.next;
            };
            ShadowBlot2.prototype.update = function(mutations, context) {
            };
            ShadowBlot2.prototype.wrap = function(name, value) {
              var wrapper = typeof name === "string" ? Registry.create(name, value) : name;
              if (this.parent != null) {
                this.parent.insertBefore(wrapper, this.next);
              }
              wrapper.appendChild(this);
              return wrapper;
            };
            ShadowBlot2.blotName = "abstract";
            return ShadowBlot2;
          }();
          exports2.default = ShadowBlot;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", { value: true });
          var attributor_1 = __webpack_require__(12);
          var class_1 = __webpack_require__(32);
          var style_1 = __webpack_require__(33);
          var Registry = __webpack_require__(1);
          var AttributorStore = function() {
            function AttributorStore2(domNode) {
              this.attributes = {};
              this.domNode = domNode;
              this.build();
            }
            AttributorStore2.prototype.attribute = function(attribute, value) {
              if (value) {
                if (attribute.add(this.domNode, value)) {
                  if (attribute.value(this.domNode) != null) {
                    this.attributes[attribute.attrName] = attribute;
                  } else {
                    delete this.attributes[attribute.attrName];
                  }
                }
              } else {
                attribute.remove(this.domNode);
                delete this.attributes[attribute.attrName];
              }
            };
            AttributorStore2.prototype.build = function() {
              var _this = this;
              this.attributes = {};
              var attributes = attributor_1.default.keys(this.domNode);
              var classes = class_1.default.keys(this.domNode);
              var styles = style_1.default.keys(this.domNode);
              attributes.concat(classes).concat(styles).forEach(function(name) {
                var attr = Registry.query(name, Registry.Scope.ATTRIBUTE);
                if (attr instanceof attributor_1.default) {
                  _this.attributes[attr.attrName] = attr;
                }
              });
            };
            AttributorStore2.prototype.copy = function(target) {
              var _this = this;
              Object.keys(this.attributes).forEach(function(key) {
                var value = _this.attributes[key].value(_this.domNode);
                target.format(key, value);
              });
            };
            AttributorStore2.prototype.move = function(target) {
              var _this = this;
              this.copy(target);
              Object.keys(this.attributes).forEach(function(key) {
                _this.attributes[key].remove(_this.domNode);
              });
              this.attributes = {};
            };
            AttributorStore2.prototype.values = function() {
              var _this = this;
              return Object.keys(this.attributes).reduce(function(attributes, name) {
                attributes[name] = _this.attributes[name].value(_this.domNode);
                return attributes;
              }, {});
            };
            return AttributorStore2;
          }();
          exports2.default = AttributorStore;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
              d.__proto__ = b;
            } || function(d, b) {
              for (var p in b)
                if (b.hasOwnProperty(p))
                  d[p] = b[p];
            };
            return function(d, b) {
              extendStatics(d, b);
              function __() {
                this.constructor = d;
              }
              d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
          }();
          Object.defineProperty(exports2, "__esModule", { value: true });
          var attributor_1 = __webpack_require__(12);
          function match(node, prefix) {
            var className = node.getAttribute("class") || "";
            return className.split(/\s+/).filter(function(name) {
              return name.indexOf(prefix + "-") === 0;
            });
          }
          var ClassAttributor = function(_super) {
            __extends(ClassAttributor2, _super);
            function ClassAttributor2() {
              return _super !== null && _super.apply(this, arguments) || this;
            }
            ClassAttributor2.keys = function(node) {
              return (node.getAttribute("class") || "").split(/\s+/).map(function(name) {
                return name.split("-").slice(0, -1).join("-");
              });
            };
            ClassAttributor2.prototype.add = function(node, value) {
              if (!this.canAdd(node, value))
                return false;
              this.remove(node);
              node.classList.add(this.keyName + "-" + value);
              return true;
            };
            ClassAttributor2.prototype.remove = function(node) {
              var matches = match(node, this.keyName);
              matches.forEach(function(name) {
                node.classList.remove(name);
              });
              if (node.classList.length === 0) {
                node.removeAttribute("class");
              }
            };
            ClassAttributor2.prototype.value = function(node) {
              var result = match(node, this.keyName)[0] || "";
              var value = result.slice(this.keyName.length + 1);
              return this.canAdd(node, value) ? value : "";
            };
            return ClassAttributor2;
          }(attributor_1.default);
          exports2.default = ClassAttributor;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
              d.__proto__ = b;
            } || function(d, b) {
              for (var p in b)
                if (b.hasOwnProperty(p))
                  d[p] = b[p];
            };
            return function(d, b) {
              extendStatics(d, b);
              function __() {
                this.constructor = d;
              }
              d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
          }();
          Object.defineProperty(exports2, "__esModule", { value: true });
          var attributor_1 = __webpack_require__(12);
          function camelize(name) {
            var parts = name.split("-");
            var rest = parts.slice(1).map(function(part) {
              return part[0].toUpperCase() + part.slice(1);
            }).join("");
            return parts[0] + rest;
          }
          var StyleAttributor = function(_super) {
            __extends(StyleAttributor2, _super);
            function StyleAttributor2() {
              return _super !== null && _super.apply(this, arguments) || this;
            }
            StyleAttributor2.keys = function(node) {
              return (node.getAttribute("style") || "").split(";").map(function(value) {
                var arr = value.split(":");
                return arr[0].trim();
              });
            };
            StyleAttributor2.prototype.add = function(node, value) {
              if (!this.canAdd(node, value))
                return false;
              node.style[camelize(this.keyName)] = value;
              return true;
            };
            StyleAttributor2.prototype.remove = function(node) {
              node.style[camelize(this.keyName)] = "";
              if (!node.getAttribute("style")) {
                node.removeAttribute("style");
              }
            };
            StyleAttributor2.prototype.value = function(node) {
              var value = node.style[camelize(this.keyName)];
              return this.canAdd(node, value) ? value : "";
            };
            return StyleAttributor2;
          }(attributor_1.default);
          exports2.default = StyleAttributor;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          var Theme = function() {
            function Theme2(quill, options) {
              _classCallCheck(this, Theme2);
              this.quill = quill;
              this.options = options;
              this.modules = {};
            }
            _createClass(Theme2, [{
              key: "init",
              value: function init() {
                var _this = this;
                Object.keys(this.options.modules).forEach(function(name) {
                  if (_this.modules[name] == null) {
                    _this.addModule(name);
                  }
                });
              }
            }, {
              key: "addModule",
              value: function addModule(name) {
                var moduleClass = this.quill.constructor.import("modules/" + name);
                this.modules[name] = new moduleClass(this.quill, this.options.modules[name] || {});
                return this.modules[name];
              }
            }]);
            return Theme2;
          }();
          Theme.DEFAULTS = {
            modules: {}
          };
          Theme.themes = {
            "default": Theme
          };
          exports2.default = Theme;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _text = __webpack_require__(7);
          var _text2 = _interopRequireDefault(_text);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var GUARD_TEXT = "\uFEFF";
          var Embed = function(_Parchment$Embed) {
            _inherits(Embed2, _Parchment$Embed);
            function Embed2(node) {
              _classCallCheck(this, Embed2);
              var _this = _possibleConstructorReturn(this, (Embed2.__proto__ || Object.getPrototypeOf(Embed2)).call(this, node));
              _this.contentNode = document.createElement("span");
              _this.contentNode.setAttribute("contenteditable", false);
              [].slice.call(_this.domNode.childNodes).forEach(function(childNode) {
                _this.contentNode.appendChild(childNode);
              });
              _this.leftGuard = document.createTextNode(GUARD_TEXT);
              _this.rightGuard = document.createTextNode(GUARD_TEXT);
              _this.domNode.appendChild(_this.leftGuard);
              _this.domNode.appendChild(_this.contentNode);
              _this.domNode.appendChild(_this.rightGuard);
              return _this;
            }
            _createClass(Embed2, [{
              key: "index",
              value: function index(node, offset) {
                if (node === this.leftGuard)
                  return 0;
                if (node === this.rightGuard)
                  return 1;
                return _get(Embed2.prototype.__proto__ || Object.getPrototypeOf(Embed2.prototype), "index", this).call(this, node, offset);
              }
            }, {
              key: "restore",
              value: function restore(node) {
                var range = void 0, textNode = void 0;
                var text = node.data.split(GUARD_TEXT).join("");
                if (node === this.leftGuard) {
                  if (this.prev instanceof _text2.default) {
                    var prevLength = this.prev.length();
                    this.prev.insertAt(prevLength, text);
                    range = {
                      startNode: this.prev.domNode,
                      startOffset: prevLength + text.length
                    };
                  } else {
                    textNode = document.createTextNode(text);
                    this.parent.insertBefore(_parchment2.default.create(textNode), this);
                    range = {
                      startNode: textNode,
                      startOffset: text.length
                    };
                  }
                } else if (node === this.rightGuard) {
                  if (this.next instanceof _text2.default) {
                    this.next.insertAt(0, text);
                    range = {
                      startNode: this.next.domNode,
                      startOffset: text.length
                    };
                  } else {
                    textNode = document.createTextNode(text);
                    this.parent.insertBefore(_parchment2.default.create(textNode), this.next);
                    range = {
                      startNode: textNode,
                      startOffset: text.length
                    };
                  }
                }
                node.data = GUARD_TEXT;
                return range;
              }
            }, {
              key: "update",
              value: function update(mutations, context) {
                var _this2 = this;
                mutations.forEach(function(mutation) {
                  if (mutation.type === "characterData" && (mutation.target === _this2.leftGuard || mutation.target === _this2.rightGuard)) {
                    var range = _this2.restore(mutation.target);
                    if (range)
                      context.range = range;
                  }
                });
              }
            }]);
            return Embed2;
          }(_parchment2.default.Embed);
          exports2.default = Embed;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.AlignStyle = exports2.AlignClass = exports2.AlignAttribute = void 0;
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          var config = {
            scope: _parchment2.default.Scope.BLOCK,
            whitelist: ["right", "center", "justify"]
          };
          var AlignAttribute = new _parchment2.default.Attributor.Attribute("align", "align", config);
          var AlignClass = new _parchment2.default.Attributor.Class("align", "ql-align", config);
          var AlignStyle = new _parchment2.default.Attributor.Style("align", "text-align", config);
          exports2.AlignAttribute = AlignAttribute;
          exports2.AlignClass = AlignClass;
          exports2.AlignStyle = AlignStyle;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.BackgroundStyle = exports2.BackgroundClass = void 0;
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _color = __webpack_require__(26);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          var BackgroundClass = new _parchment2.default.Attributor.Class("background", "ql-bg", {
            scope: _parchment2.default.Scope.INLINE
          });
          var BackgroundStyle = new _color.ColorAttributor("background", "background-color", {
            scope: _parchment2.default.Scope.INLINE
          });
          exports2.BackgroundClass = BackgroundClass;
          exports2.BackgroundStyle = BackgroundStyle;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.DirectionStyle = exports2.DirectionClass = exports2.DirectionAttribute = void 0;
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          var config = {
            scope: _parchment2.default.Scope.BLOCK,
            whitelist: ["rtl"]
          };
          var DirectionAttribute = new _parchment2.default.Attributor.Attribute("direction", "dir", config);
          var DirectionClass = new _parchment2.default.Attributor.Class("direction", "ql-direction", config);
          var DirectionStyle = new _parchment2.default.Attributor.Style("direction", "direction", config);
          exports2.DirectionAttribute = DirectionAttribute;
          exports2.DirectionClass = DirectionClass;
          exports2.DirectionStyle = DirectionStyle;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.FontClass = exports2.FontStyle = void 0;
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var config = {
            scope: _parchment2.default.Scope.INLINE,
            whitelist: ["serif", "monospace"]
          };
          var FontClass = new _parchment2.default.Attributor.Class("font", "ql-font", config);
          var FontStyleAttributor = function(_Parchment$Attributor) {
            _inherits(FontStyleAttributor2, _Parchment$Attributor);
            function FontStyleAttributor2() {
              _classCallCheck(this, FontStyleAttributor2);
              return _possibleConstructorReturn(this, (FontStyleAttributor2.__proto__ || Object.getPrototypeOf(FontStyleAttributor2)).apply(this, arguments));
            }
            _createClass(FontStyleAttributor2, [{
              key: "value",
              value: function value(node) {
                return _get(FontStyleAttributor2.prototype.__proto__ || Object.getPrototypeOf(FontStyleAttributor2.prototype), "value", this).call(this, node).replace(/["']/g, "");
              }
            }]);
            return FontStyleAttributor2;
          }(_parchment2.default.Attributor.Style);
          var FontStyle = new FontStyleAttributor("font", "font-family", config);
          exports2.FontStyle = FontStyle;
          exports2.FontClass = FontClass;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.SizeStyle = exports2.SizeClass = void 0;
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          var SizeClass = new _parchment2.default.Attributor.Class("size", "ql-size", {
            scope: _parchment2.default.Scope.INLINE,
            whitelist: ["small", "large", "huge"]
          });
          var SizeStyle = new _parchment2.default.Attributor.Style("size", "font-size", {
            scope: _parchment2.default.Scope.INLINE,
            whitelist: ["10px", "18px", "32px"]
          });
          exports2.SizeClass = SizeClass;
          exports2.SizeStyle = SizeStyle;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          module2.exports = {
            "align": {
              "": __webpack_require__(76),
              "center": __webpack_require__(77),
              "right": __webpack_require__(78),
              "justify": __webpack_require__(79)
            },
            "background": __webpack_require__(80),
            "blockquote": __webpack_require__(81),
            "bold": __webpack_require__(82),
            "clean": __webpack_require__(83),
            "code": __webpack_require__(58),
            "code-block": __webpack_require__(58),
            "color": __webpack_require__(84),
            "direction": {
              "": __webpack_require__(85),
              "rtl": __webpack_require__(86)
            },
            "float": {
              "center": __webpack_require__(87),
              "full": __webpack_require__(88),
              "left": __webpack_require__(89),
              "right": __webpack_require__(90)
            },
            "formula": __webpack_require__(91),
            "header": {
              "1": __webpack_require__(92),
              "2": __webpack_require__(93)
            },
            "italic": __webpack_require__(94),
            "image": __webpack_require__(95),
            "indent": {
              "+1": __webpack_require__(96),
              "-1": __webpack_require__(97)
            },
            "link": __webpack_require__(98),
            "list": {
              "ordered": __webpack_require__(99),
              "bullet": __webpack_require__(100),
              "check": __webpack_require__(101)
            },
            "script": {
              "sub": __webpack_require__(102),
              "super": __webpack_require__(103)
            },
            "strike": __webpack_require__(104),
            "underline": __webpack_require__(105),
            "video": __webpack_require__(106)
          };
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.getLastChangeIndex = exports2.default = void 0;
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _quill = __webpack_require__(5);
          var _quill2 = _interopRequireDefault(_quill);
          var _module = __webpack_require__(9);
          var _module2 = _interopRequireDefault(_module);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var History = function(_Module) {
            _inherits(History2, _Module);
            function History2(quill, options) {
              _classCallCheck(this, History2);
              var _this = _possibleConstructorReturn(this, (History2.__proto__ || Object.getPrototypeOf(History2)).call(this, quill, options));
              _this.lastRecorded = 0;
              _this.ignoreChange = false;
              _this.clear();
              _this.quill.on(_quill2.default.events.EDITOR_CHANGE, function(eventName, delta, oldDelta, source) {
                if (eventName !== _quill2.default.events.TEXT_CHANGE || _this.ignoreChange)
                  return;
                if (!_this.options.userOnly || source === _quill2.default.sources.USER) {
                  _this.record(delta, oldDelta);
                } else {
                  _this.transform(delta);
                }
              });
              _this.quill.keyboard.addBinding({ key: "Z", shortKey: true }, _this.undo.bind(_this));
              _this.quill.keyboard.addBinding({ key: "Z", shortKey: true, shiftKey: true }, _this.redo.bind(_this));
              if (/Win/i.test(navigator.platform)) {
                _this.quill.keyboard.addBinding({ key: "Y", shortKey: true }, _this.redo.bind(_this));
              }
              return _this;
            }
            _createClass(History2, [{
              key: "change",
              value: function change(source, dest) {
                if (this.stack[source].length === 0)
                  return;
                var delta = this.stack[source].pop();
                this.stack[dest].push(delta);
                this.lastRecorded = 0;
                this.ignoreChange = true;
                this.quill.updateContents(delta[source], _quill2.default.sources.USER);
                this.ignoreChange = false;
                var index = getLastChangeIndex(delta[source]);
                this.quill.setSelection(index);
              }
            }, {
              key: "clear",
              value: function clear() {
                this.stack = { undo: [], redo: [] };
              }
            }, {
              key: "cutoff",
              value: function cutoff() {
                this.lastRecorded = 0;
              }
            }, {
              key: "record",
              value: function record(changeDelta, oldDelta) {
                if (changeDelta.ops.length === 0)
                  return;
                this.stack.redo = [];
                var undoDelta = this.quill.getContents().diff(oldDelta);
                var timestamp = Date.now();
                if (this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0) {
                  var delta = this.stack.undo.pop();
                  undoDelta = undoDelta.compose(delta.undo);
                  changeDelta = delta.redo.compose(changeDelta);
                } else {
                  this.lastRecorded = timestamp;
                }
                this.stack.undo.push({
                  redo: changeDelta,
                  undo: undoDelta
                });
                if (this.stack.undo.length > this.options.maxStack) {
                  this.stack.undo.shift();
                }
              }
            }, {
              key: "redo",
              value: function redo() {
                this.change("redo", "undo");
              }
            }, {
              key: "transform",
              value: function transform(delta) {
                this.stack.undo.forEach(function(change) {
                  change.undo = delta.transform(change.undo, true);
                  change.redo = delta.transform(change.redo, true);
                });
                this.stack.redo.forEach(function(change) {
                  change.undo = delta.transform(change.undo, true);
                  change.redo = delta.transform(change.redo, true);
                });
              }
            }, {
              key: "undo",
              value: function undo() {
                this.change("undo", "redo");
              }
            }]);
            return History2;
          }(_module2.default);
          History.DEFAULTS = {
            delay: 1e3,
            maxStack: 100,
            userOnly: false
          };
          function endsWithNewlineChange(delta) {
            var lastOp = delta.ops[delta.ops.length - 1];
            if (lastOp == null)
              return false;
            if (lastOp.insert != null) {
              return typeof lastOp.insert === "string" && lastOp.insert.endsWith("\n");
            }
            if (lastOp.attributes != null) {
              return Object.keys(lastOp.attributes).some(function(attr) {
                return _parchment2.default.query(attr, _parchment2.default.Scope.BLOCK) != null;
              });
            }
            return false;
          }
          function getLastChangeIndex(delta) {
            var deleteLength = delta.reduce(function(length, op) {
              length += op.delete || 0;
              return length;
            }, 0);
            var changeIndex = delta.length() - deleteLength;
            if (endsWithNewlineChange(delta)) {
              changeIndex -= 1;
            }
            return changeIndex;
          }
          exports2.default = History;
          exports2.getLastChangeIndex = getLastChangeIndex;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.default = exports2.BaseTooltip = void 0;
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _extend = __webpack_require__(3);
          var _extend2 = _interopRequireDefault(_extend);
          var _quillDelta = __webpack_require__(2);
          var _quillDelta2 = _interopRequireDefault(_quillDelta);
          var _emitter = __webpack_require__(8);
          var _emitter2 = _interopRequireDefault(_emitter);
          var _keyboard = __webpack_require__(23);
          var _keyboard2 = _interopRequireDefault(_keyboard);
          var _theme = __webpack_require__(34);
          var _theme2 = _interopRequireDefault(_theme);
          var _colorPicker = __webpack_require__(59);
          var _colorPicker2 = _interopRequireDefault(_colorPicker);
          var _iconPicker = __webpack_require__(60);
          var _iconPicker2 = _interopRequireDefault(_iconPicker);
          var _picker = __webpack_require__(28);
          var _picker2 = _interopRequireDefault(_picker);
          var _tooltip = __webpack_require__(61);
          var _tooltip2 = _interopRequireDefault(_tooltip);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var ALIGNS = [false, "center", "right", "justify"];
          var COLORS = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"];
          var FONTS = [false, "serif", "monospace"];
          var HEADERS = ["1", "2", "3", false];
          var SIZES = ["small", false, "large", "huge"];
          var BaseTheme = function(_Theme) {
            _inherits(BaseTheme2, _Theme);
            function BaseTheme2(quill, options) {
              _classCallCheck(this, BaseTheme2);
              var _this = _possibleConstructorReturn(this, (BaseTheme2.__proto__ || Object.getPrototypeOf(BaseTheme2)).call(this, quill, options));
              var listener = function listener2(e) {
                if (!document.body.contains(quill.root)) {
                  return document.body.removeEventListener("click", listener2);
                }
                if (_this.tooltip != null && !_this.tooltip.root.contains(e.target) && document.activeElement !== _this.tooltip.textbox && !_this.quill.hasFocus()) {
                  _this.tooltip.hide();
                }
                if (_this.pickers != null) {
                  _this.pickers.forEach(function(picker) {
                    if (!picker.container.contains(e.target)) {
                      picker.close();
                    }
                  });
                }
              };
              quill.emitter.listenDOM("click", document.body, listener);
              return _this;
            }
            _createClass(BaseTheme2, [{
              key: "addModule",
              value: function addModule(name) {
                var module3 = _get(BaseTheme2.prototype.__proto__ || Object.getPrototypeOf(BaseTheme2.prototype), "addModule", this).call(this, name);
                if (name === "toolbar") {
                  this.extendToolbar(module3);
                }
                return module3;
              }
            }, {
              key: "buildButtons",
              value: function buildButtons(buttons, icons) {
                buttons.forEach(function(button) {
                  var className = button.getAttribute("class") || "";
                  className.split(/\s+/).forEach(function(name) {
                    if (!name.startsWith("ql-"))
                      return;
                    name = name.slice("ql-".length);
                    if (icons[name] == null)
                      return;
                    if (name === "direction") {
                      button.innerHTML = icons[name][""] + icons[name]["rtl"];
                    } else if (typeof icons[name] === "string") {
                      button.innerHTML = icons[name];
                    } else {
                      var value = button.value || "";
                      if (value != null && icons[name][value]) {
                        button.innerHTML = icons[name][value];
                      }
                    }
                  });
                });
              }
            }, {
              key: "buildPickers",
              value: function buildPickers(selects, icons) {
                var _this2 = this;
                this.pickers = selects.map(function(select) {
                  if (select.classList.contains("ql-align")) {
                    if (select.querySelector("option") == null) {
                      fillSelect(select, ALIGNS);
                    }
                    return new _iconPicker2.default(select, icons.align);
                  } else if (select.classList.contains("ql-background") || select.classList.contains("ql-color")) {
                    var format = select.classList.contains("ql-background") ? "background" : "color";
                    if (select.querySelector("option") == null) {
                      fillSelect(select, COLORS, format === "background" ? "#ffffff" : "#000000");
                    }
                    return new _colorPicker2.default(select, icons[format]);
                  } else {
                    if (select.querySelector("option") == null) {
                      if (select.classList.contains("ql-font")) {
                        fillSelect(select, FONTS);
                      } else if (select.classList.contains("ql-header")) {
                        fillSelect(select, HEADERS);
                      } else if (select.classList.contains("ql-size")) {
                        fillSelect(select, SIZES);
                      }
                    }
                    return new _picker2.default(select);
                  }
                });
                var update = function update2() {
                  _this2.pickers.forEach(function(picker) {
                    picker.update();
                  });
                };
                this.quill.on(_emitter2.default.events.EDITOR_CHANGE, update);
              }
            }]);
            return BaseTheme2;
          }(_theme2.default);
          BaseTheme.DEFAULTS = (0, _extend2.default)(true, {}, _theme2.default.DEFAULTS, {
            modules: {
              toolbar: {
                handlers: {
                  formula: function formula() {
                    this.quill.theme.tooltip.edit("formula");
                  },
                  image: function image() {
                    var _this3 = this;
                    var fileInput = this.container.querySelector("input.ql-image[type=file]");
                    if (fileInput == null) {
                      fileInput = document.createElement("input");
                      fileInput.setAttribute("type", "file");
                      fileInput.setAttribute("accept", "image/png, image/gif, image/jpeg, image/bmp, image/x-icon");
                      fileInput.classList.add("ql-image");
                      fileInput.addEventListener("change", function() {
                        if (fileInput.files != null && fileInput.files[0] != null) {
                          var reader = new FileReader();
                          reader.onload = function(e) {
                            var range = _this3.quill.getSelection(true);
                            _this3.quill.updateContents(new _quillDelta2.default().retain(range.index).delete(range.length).insert({ image: e.target.result }), _emitter2.default.sources.USER);
                            _this3.quill.setSelection(range.index + 1, _emitter2.default.sources.SILENT);
                            fileInput.value = "";
                          };
                          reader.readAsDataURL(fileInput.files[0]);
                        }
                      });
                      this.container.appendChild(fileInput);
                    }
                    fileInput.click();
                  },
                  video: function video() {
                    this.quill.theme.tooltip.edit("video");
                  }
                }
              }
            }
          });
          var BaseTooltip = function(_Tooltip) {
            _inherits(BaseTooltip2, _Tooltip);
            function BaseTooltip2(quill, boundsContainer) {
              _classCallCheck(this, BaseTooltip2);
              var _this4 = _possibleConstructorReturn(this, (BaseTooltip2.__proto__ || Object.getPrototypeOf(BaseTooltip2)).call(this, quill, boundsContainer));
              _this4.textbox = _this4.root.querySelector('input[type="text"]');
              _this4.listen();
              return _this4;
            }
            _createClass(BaseTooltip2, [{
              key: "listen",
              value: function listen() {
                var _this5 = this;
                this.textbox.addEventListener("keydown", function(event) {
                  if (_keyboard2.default.match(event, "enter")) {
                    _this5.save();
                    event.preventDefault();
                  } else if (_keyboard2.default.match(event, "escape")) {
                    _this5.cancel();
                    event.preventDefault();
                  }
                });
              }
            }, {
              key: "cancel",
              value: function cancel() {
                this.hide();
              }
            }, {
              key: "edit",
              value: function edit() {
                var mode = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "link";
                var preview = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
                this.root.classList.remove("ql-hidden");
                this.root.classList.add("ql-editing");
                if (preview != null) {
                  this.textbox.value = preview;
                } else if (mode !== this.root.getAttribute("data-mode")) {
                  this.textbox.value = "";
                }
                this.position(this.quill.getBounds(this.quill.selection.savedRange));
                this.textbox.select();
                this.textbox.setAttribute("placeholder", this.textbox.getAttribute("data-" + mode) || "");
                this.root.setAttribute("data-mode", mode);
              }
            }, {
              key: "restoreFocus",
              value: function restoreFocus() {
                var scrollTop = this.quill.scrollingContainer.scrollTop;
                this.quill.focus();
                this.quill.scrollingContainer.scrollTop = scrollTop;
              }
            }, {
              key: "save",
              value: function save() {
                var value = this.textbox.value;
                switch (this.root.getAttribute("data-mode")) {
                  case "link": {
                    var scrollTop = this.quill.root.scrollTop;
                    if (this.linkRange) {
                      this.quill.formatText(this.linkRange, "link", value, _emitter2.default.sources.USER);
                      delete this.linkRange;
                    } else {
                      this.restoreFocus();
                      this.quill.format("link", value, _emitter2.default.sources.USER);
                    }
                    this.quill.root.scrollTop = scrollTop;
                    break;
                  }
                  case "video": {
                    value = extractVideoUrl(value);
                  }
                  case "formula": {
                    if (!value)
                      break;
                    var range = this.quill.getSelection(true);
                    if (range != null) {
                      var index = range.index + range.length;
                      this.quill.insertEmbed(index, this.root.getAttribute("data-mode"), value, _emitter2.default.sources.USER);
                      if (this.root.getAttribute("data-mode") === "formula") {
                        this.quill.insertText(index + 1, " ", _emitter2.default.sources.USER);
                      }
                      this.quill.setSelection(index + 2, _emitter2.default.sources.USER);
                    }
                    break;
                  }
                  default:
                }
                this.textbox.value = "";
                this.hide();
              }
            }]);
            return BaseTooltip2;
          }(_tooltip2.default);
          function extractVideoUrl(url) {
            var match = url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
            if (match) {
              return (match[1] || "https") + "://www.youtube.com/embed/" + match[2] + "?showinfo=0";
            }
            if (match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) {
              return (match[1] || "https") + "://player.vimeo.com/video/" + match[2] + "/";
            }
            return url;
          }
          function fillSelect(select, values) {
            var defaultValue = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
            values.forEach(function(value) {
              var option = document.createElement("option");
              if (value === defaultValue) {
                option.setAttribute("selected", "selected");
              } else {
                option.setAttribute("value", value);
              }
              select.appendChild(option);
            });
          }
          exports2.BaseTooltip = BaseTooltip;
          exports2.default = BaseTheme;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", { value: true });
          var LinkedList = function() {
            function LinkedList2() {
              this.head = this.tail = null;
              this.length = 0;
            }
            LinkedList2.prototype.append = function() {
              var nodes = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                nodes[_i] = arguments[_i];
              }
              this.insertBefore(nodes[0], null);
              if (nodes.length > 1) {
                this.append.apply(this, nodes.slice(1));
              }
            };
            LinkedList2.prototype.contains = function(node) {
              var cur, next = this.iterator();
              while (cur = next()) {
                if (cur === node)
                  return true;
              }
              return false;
            };
            LinkedList2.prototype.insertBefore = function(node, refNode) {
              if (!node)
                return;
              node.next = refNode;
              if (refNode != null) {
                node.prev = refNode.prev;
                if (refNode.prev != null) {
                  refNode.prev.next = node;
                }
                refNode.prev = node;
                if (refNode === this.head) {
                  this.head = node;
                }
              } else if (this.tail != null) {
                this.tail.next = node;
                node.prev = this.tail;
                this.tail = node;
              } else {
                node.prev = null;
                this.head = this.tail = node;
              }
              this.length += 1;
            };
            LinkedList2.prototype.offset = function(target) {
              var index = 0, cur = this.head;
              while (cur != null) {
                if (cur === target)
                  return index;
                index += cur.length();
                cur = cur.next;
              }
              return -1;
            };
            LinkedList2.prototype.remove = function(node) {
              if (!this.contains(node))
                return;
              if (node.prev != null)
                node.prev.next = node.next;
              if (node.next != null)
                node.next.prev = node.prev;
              if (node === this.head)
                this.head = node.next;
              if (node === this.tail)
                this.tail = node.prev;
              this.length -= 1;
            };
            LinkedList2.prototype.iterator = function(curNode) {
              if (curNode === void 0) {
                curNode = this.head;
              }
              return function() {
                var ret = curNode;
                if (curNode != null)
                  curNode = curNode.next;
                return ret;
              };
            };
            LinkedList2.prototype.find = function(index, inclusive) {
              if (inclusive === void 0) {
                inclusive = false;
              }
              var cur, next = this.iterator();
              while (cur = next()) {
                var length = cur.length();
                if (index < length || inclusive && index === length && (cur.next == null || cur.next.length() !== 0)) {
                  return [cur, index];
                }
                index -= length;
              }
              return [null, 0];
            };
            LinkedList2.prototype.forEach = function(callback) {
              var cur, next = this.iterator();
              while (cur = next()) {
                callback(cur);
              }
            };
            LinkedList2.prototype.forEachAt = function(index, length, callback) {
              if (length <= 0)
                return;
              var _a = this.find(index), startNode = _a[0], offset = _a[1];
              var cur, curIndex = index - offset, next = this.iterator(startNode);
              while ((cur = next()) && curIndex < index + length) {
                var curLength = cur.length();
                if (index > curIndex) {
                  callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index));
                } else {
                  callback(cur, 0, Math.min(curLength, index + length - curIndex));
                }
                curIndex += curLength;
              }
            };
            LinkedList2.prototype.map = function(callback) {
              return this.reduce(function(memo, cur) {
                memo.push(callback(cur));
                return memo;
              }, []);
            };
            LinkedList2.prototype.reduce = function(callback, memo) {
              var cur, next = this.iterator();
              while (cur = next()) {
                memo = callback(memo, cur);
              }
              return memo;
            };
            return LinkedList2;
          }();
          exports2.default = LinkedList;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
              d.__proto__ = b;
            } || function(d, b) {
              for (var p in b)
                if (b.hasOwnProperty(p))
                  d[p] = b[p];
            };
            return function(d, b) {
              extendStatics(d, b);
              function __() {
                this.constructor = d;
              }
              d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
          }();
          Object.defineProperty(exports2, "__esModule", { value: true });
          var container_1 = __webpack_require__(17);
          var Registry = __webpack_require__(1);
          var OBSERVER_CONFIG = {
            attributes: true,
            characterData: true,
            characterDataOldValue: true,
            childList: true,
            subtree: true
          };
          var MAX_OPTIMIZE_ITERATIONS = 100;
          var ScrollBlot = function(_super) {
            __extends(ScrollBlot2, _super);
            function ScrollBlot2(node) {
              var _this = _super.call(this, node) || this;
              _this.scroll = _this;
              _this.observer = new MutationObserver(function(mutations) {
                _this.update(mutations);
              });
              _this.observer.observe(_this.domNode, OBSERVER_CONFIG);
              _this.attach();
              return _this;
            }
            ScrollBlot2.prototype.detach = function() {
              _super.prototype.detach.call(this);
              this.observer.disconnect();
            };
            ScrollBlot2.prototype.deleteAt = function(index, length) {
              this.update();
              if (index === 0 && length === this.length()) {
                this.children.forEach(function(child) {
                  child.remove();
                });
              } else {
                _super.prototype.deleteAt.call(this, index, length);
              }
            };
            ScrollBlot2.prototype.formatAt = function(index, length, name, value) {
              this.update();
              _super.prototype.formatAt.call(this, index, length, name, value);
            };
            ScrollBlot2.prototype.insertAt = function(index, value, def) {
              this.update();
              _super.prototype.insertAt.call(this, index, value, def);
            };
            ScrollBlot2.prototype.optimize = function(mutations, context) {
              var _this = this;
              if (mutations === void 0) {
                mutations = [];
              }
              if (context === void 0) {
                context = {};
              }
              _super.prototype.optimize.call(this, context);
              var records = [].slice.call(this.observer.takeRecords());
              while (records.length > 0)
                mutations.push(records.pop());
              var mark = function(blot, markParent) {
                if (markParent === void 0) {
                  markParent = true;
                }
                if (blot == null || blot === _this)
                  return;
                if (blot.domNode.parentNode == null)
                  return;
                if (blot.domNode[Registry.DATA_KEY].mutations == null) {
                  blot.domNode[Registry.DATA_KEY].mutations = [];
                }
                if (markParent)
                  mark(blot.parent);
              };
              var optimize = function(blot) {
                if (blot.domNode[Registry.DATA_KEY] == null || blot.domNode[Registry.DATA_KEY].mutations == null) {
                  return;
                }
                if (blot instanceof container_1.default) {
                  blot.children.forEach(optimize);
                }
                blot.optimize(context);
              };
              var remaining = mutations;
              for (var i = 0; remaining.length > 0; i += 1) {
                if (i >= MAX_OPTIMIZE_ITERATIONS) {
                  throw new Error("[Parchment] Maximum optimize iterations reached");
                }
                remaining.forEach(function(mutation) {
                  var blot = Registry.find(mutation.target, true);
                  if (blot == null)
                    return;
                  if (blot.domNode === mutation.target) {
                    if (mutation.type === "childList") {
                      mark(Registry.find(mutation.previousSibling, false));
                      [].forEach.call(mutation.addedNodes, function(node) {
                        var child = Registry.find(node, false);
                        mark(child, false);
                        if (child instanceof container_1.default) {
                          child.children.forEach(function(grandChild) {
                            mark(grandChild, false);
                          });
                        }
                      });
                    } else if (mutation.type === "attributes") {
                      mark(blot.prev);
                    }
                  }
                  mark(blot);
                });
                this.children.forEach(optimize);
                remaining = [].slice.call(this.observer.takeRecords());
                records = remaining.slice();
                while (records.length > 0)
                  mutations.push(records.pop());
              }
            };
            ScrollBlot2.prototype.update = function(mutations, context) {
              var _this = this;
              if (context === void 0) {
                context = {};
              }
              mutations = mutations || this.observer.takeRecords();
              mutations.map(function(mutation) {
                var blot = Registry.find(mutation.target, true);
                if (blot == null)
                  return null;
                if (blot.domNode[Registry.DATA_KEY].mutations == null) {
                  blot.domNode[Registry.DATA_KEY].mutations = [mutation];
                  return blot;
                } else {
                  blot.domNode[Registry.DATA_KEY].mutations.push(mutation);
                  return null;
                }
              }).forEach(function(blot) {
                if (blot == null || blot === _this || blot.domNode[Registry.DATA_KEY] == null)
                  return;
                blot.update(blot.domNode[Registry.DATA_KEY].mutations || [], context);
              });
              if (this.domNode[Registry.DATA_KEY].mutations != null) {
                _super.prototype.update.call(this, this.domNode[Registry.DATA_KEY].mutations, context);
              }
              this.optimize(mutations, context);
            };
            ScrollBlot2.blotName = "scroll";
            ScrollBlot2.defaultChild = "block";
            ScrollBlot2.scope = Registry.Scope.BLOCK_BLOT;
            ScrollBlot2.tagName = "DIV";
            return ScrollBlot2;
          }(container_1.default);
          exports2.default = ScrollBlot;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
              d.__proto__ = b;
            } || function(d, b) {
              for (var p in b)
                if (b.hasOwnProperty(p))
                  d[p] = b[p];
            };
            return function(d, b) {
              extendStatics(d, b);
              function __() {
                this.constructor = d;
              }
              d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
          }();
          Object.defineProperty(exports2, "__esModule", { value: true });
          var format_1 = __webpack_require__(18);
          var Registry = __webpack_require__(1);
          function isEqual(obj1, obj2) {
            if (Object.keys(obj1).length !== Object.keys(obj2).length)
              return false;
            for (var prop in obj1) {
              if (obj1[prop] !== obj2[prop])
                return false;
            }
            return true;
          }
          var InlineBlot = function(_super) {
            __extends(InlineBlot2, _super);
            function InlineBlot2() {
              return _super !== null && _super.apply(this, arguments) || this;
            }
            InlineBlot2.formats = function(domNode) {
              if (domNode.tagName === InlineBlot2.tagName)
                return void 0;
              return _super.formats.call(this, domNode);
            };
            InlineBlot2.prototype.format = function(name, value) {
              var _this = this;
              if (name === this.statics.blotName && !value) {
                this.children.forEach(function(child) {
                  if (!(child instanceof format_1.default)) {
                    child = child.wrap(InlineBlot2.blotName, true);
                  }
                  _this.attributes.copy(child);
                });
                this.unwrap();
              } else {
                _super.prototype.format.call(this, name, value);
              }
            };
            InlineBlot2.prototype.formatAt = function(index, length, name, value) {
              if (this.formats()[name] != null || Registry.query(name, Registry.Scope.ATTRIBUTE)) {
                var blot = this.isolate(index, length);
                blot.format(name, value);
              } else {
                _super.prototype.formatAt.call(this, index, length, name, value);
              }
            };
            InlineBlot2.prototype.optimize = function(context) {
              _super.prototype.optimize.call(this, context);
              var formats = this.formats();
              if (Object.keys(formats).length === 0) {
                return this.unwrap();
              }
              var next = this.next;
              if (next instanceof InlineBlot2 && next.prev === this && isEqual(formats, next.formats())) {
                next.moveChildren(this);
                next.remove();
              }
            };
            InlineBlot2.blotName = "inline";
            InlineBlot2.scope = Registry.Scope.INLINE_BLOT;
            InlineBlot2.tagName = "SPAN";
            return InlineBlot2;
          }(format_1.default);
          exports2.default = InlineBlot;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
              d.__proto__ = b;
            } || function(d, b) {
              for (var p in b)
                if (b.hasOwnProperty(p))
                  d[p] = b[p];
            };
            return function(d, b) {
              extendStatics(d, b);
              function __() {
                this.constructor = d;
              }
              d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
          }();
          Object.defineProperty(exports2, "__esModule", { value: true });
          var format_1 = __webpack_require__(18);
          var Registry = __webpack_require__(1);
          var BlockBlot = function(_super) {
            __extends(BlockBlot2, _super);
            function BlockBlot2() {
              return _super !== null && _super.apply(this, arguments) || this;
            }
            BlockBlot2.formats = function(domNode) {
              var tagName = Registry.query(BlockBlot2.blotName).tagName;
              if (domNode.tagName === tagName)
                return void 0;
              return _super.formats.call(this, domNode);
            };
            BlockBlot2.prototype.format = function(name, value) {
              if (Registry.query(name, Registry.Scope.BLOCK) == null) {
                return;
              } else if (name === this.statics.blotName && !value) {
                this.replaceWith(BlockBlot2.blotName);
              } else {
                _super.prototype.format.call(this, name, value);
              }
            };
            BlockBlot2.prototype.formatAt = function(index, length, name, value) {
              if (Registry.query(name, Registry.Scope.BLOCK) != null) {
                this.format(name, value);
              } else {
                _super.prototype.formatAt.call(this, index, length, name, value);
              }
            };
            BlockBlot2.prototype.insertAt = function(index, value, def) {
              if (def == null || Registry.query(value, Registry.Scope.INLINE) != null) {
                _super.prototype.insertAt.call(this, index, value, def);
              } else {
                var after = this.split(index);
                var blot = Registry.create(value, def);
                after.parent.insertBefore(blot, after);
              }
            };
            BlockBlot2.prototype.update = function(mutations, context) {
              if (navigator.userAgent.match(/Trident/)) {
                this.build();
              } else {
                _super.prototype.update.call(this, mutations, context);
              }
            };
            BlockBlot2.blotName = "block";
            BlockBlot2.scope = Registry.Scope.BLOCK_BLOT;
            BlockBlot2.tagName = "P";
            return BlockBlot2;
          }(format_1.default);
          exports2.default = BlockBlot;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
              d.__proto__ = b;
            } || function(d, b) {
              for (var p in b)
                if (b.hasOwnProperty(p))
                  d[p] = b[p];
            };
            return function(d, b) {
              extendStatics(d, b);
              function __() {
                this.constructor = d;
              }
              d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
          }();
          Object.defineProperty(exports2, "__esModule", { value: true });
          var leaf_1 = __webpack_require__(19);
          var EmbedBlot = function(_super) {
            __extends(EmbedBlot2, _super);
            function EmbedBlot2() {
              return _super !== null && _super.apply(this, arguments) || this;
            }
            EmbedBlot2.formats = function(domNode) {
              return void 0;
            };
            EmbedBlot2.prototype.format = function(name, value) {
              _super.prototype.formatAt.call(this, 0, this.length(), name, value);
            };
            EmbedBlot2.prototype.formatAt = function(index, length, name, value) {
              if (index === 0 && length === this.length()) {
                this.format(name, value);
              } else {
                _super.prototype.formatAt.call(this, index, length, name, value);
              }
            };
            EmbedBlot2.prototype.formats = function() {
              return this.statics.formats(this.domNode);
            };
            return EmbedBlot2;
          }(leaf_1.default);
          exports2.default = EmbedBlot;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
              d.__proto__ = b;
            } || function(d, b) {
              for (var p in b)
                if (b.hasOwnProperty(p))
                  d[p] = b[p];
            };
            return function(d, b) {
              extendStatics(d, b);
              function __() {
                this.constructor = d;
              }
              d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
          }();
          Object.defineProperty(exports2, "__esModule", { value: true });
          var leaf_1 = __webpack_require__(19);
          var Registry = __webpack_require__(1);
          var TextBlot = function(_super) {
            __extends(TextBlot2, _super);
            function TextBlot2(node) {
              var _this = _super.call(this, node) || this;
              _this.text = _this.statics.value(_this.domNode);
              return _this;
            }
            TextBlot2.create = function(value) {
              return document.createTextNode(value);
            };
            TextBlot2.value = function(domNode) {
              var text = domNode.data;
              if (text["normalize"])
                text = text["normalize"]();
              return text;
            };
            TextBlot2.prototype.deleteAt = function(index, length) {
              this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
            };
            TextBlot2.prototype.index = function(node, offset) {
              if (this.domNode === node) {
                return offset;
              }
              return -1;
            };
            TextBlot2.prototype.insertAt = function(index, value, def) {
              if (def == null) {
                this.text = this.text.slice(0, index) + value + this.text.slice(index);
                this.domNode.data = this.text;
              } else {
                _super.prototype.insertAt.call(this, index, value, def);
              }
            };
            TextBlot2.prototype.length = function() {
              return this.text.length;
            };
            TextBlot2.prototype.optimize = function(context) {
              _super.prototype.optimize.call(this, context);
              this.text = this.statics.value(this.domNode);
              if (this.text.length === 0) {
                this.remove();
              } else if (this.next instanceof TextBlot2 && this.next.prev === this) {
                this.insertAt(this.length(), this.next.value());
                this.next.remove();
              }
            };
            TextBlot2.prototype.position = function(index, inclusive) {
              if (inclusive === void 0) {
                inclusive = false;
              }
              return [this.domNode, index];
            };
            TextBlot2.prototype.split = function(index, force) {
              if (force === void 0) {
                force = false;
              }
              if (!force) {
                if (index === 0)
                  return this;
                if (index === this.length())
                  return this.next;
              }
              var after = Registry.create(this.domNode.splitText(index));
              this.parent.insertBefore(after, this.next);
              this.text = this.statics.value(this.domNode);
              return after;
            };
            TextBlot2.prototype.update = function(mutations, context) {
              var _this = this;
              if (mutations.some(function(mutation) {
                return mutation.type === "characterData" && mutation.target === _this.domNode;
              })) {
                this.text = this.statics.value(this.domNode);
              }
            };
            TextBlot2.prototype.value = function() {
              return this.text;
            };
            TextBlot2.blotName = "text";
            TextBlot2.scope = Registry.Scope.INLINE_BLOT;
            return TextBlot2;
          }(leaf_1.default);
          exports2.default = TextBlot;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var elem = document.createElement("div");
          elem.classList.toggle("test-class", false);
          if (elem.classList.contains("test-class")) {
            var _toggle = DOMTokenList.prototype.toggle;
            DOMTokenList.prototype.toggle = function(token, force) {
              if (arguments.length > 1 && !this.contains(token) === !force) {
                return force;
              } else {
                return _toggle.call(this, token);
              }
            };
          }
          if (!String.prototype.startsWith) {
            String.prototype.startsWith = function(searchString, position) {
              position = position || 0;
              return this.substr(position, searchString.length) === searchString;
            };
          }
          if (!String.prototype.endsWith) {
            String.prototype.endsWith = function(searchString, position) {
              var subjectString = this.toString();
              if (typeof position !== "number" || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                position = subjectString.length;
              }
              position -= searchString.length;
              var lastIndex = subjectString.indexOf(searchString, position);
              return lastIndex !== -1 && lastIndex === position;
            };
          }
          if (!Array.prototype.find) {
            Object.defineProperty(Array.prototype, "find", {
              value: function value(predicate) {
                if (this === null) {
                  throw new TypeError("Array.prototype.find called on null or undefined");
                }
                if (typeof predicate !== "function") {
                  throw new TypeError("predicate must be a function");
                }
                var list = Object(this);
                var length = list.length >>> 0;
                var thisArg = arguments[1];
                var value2;
                for (var i = 0; i < length; i++) {
                  value2 = list[i];
                  if (predicate.call(thisArg, value2, i, list)) {
                    return value2;
                  }
                }
                return void 0;
              }
            });
          }
          document.addEventListener("DOMContentLoaded", function() {
            document.execCommand("enableObjectResizing", false, false);
            document.execCommand("autoUrlDetect", false, false);
          });
        },
        function(module2, exports2) {
          var DIFF_DELETE = -1;
          var DIFF_INSERT = 1;
          var DIFF_EQUAL = 0;
          function diff_main(text1, text2, cursor_pos) {
            if (text1 == text2) {
              if (text1) {
                return [[DIFF_EQUAL, text1]];
              }
              return [];
            }
            if (cursor_pos < 0 || text1.length < cursor_pos) {
              cursor_pos = null;
            }
            var commonlength = diff_commonPrefix(text1, text2);
            var commonprefix = text1.substring(0, commonlength);
            text1 = text1.substring(commonlength);
            text2 = text2.substring(commonlength);
            commonlength = diff_commonSuffix(text1, text2);
            var commonsuffix = text1.substring(text1.length - commonlength);
            text1 = text1.substring(0, text1.length - commonlength);
            text2 = text2.substring(0, text2.length - commonlength);
            var diffs = diff_compute_(text1, text2);
            if (commonprefix) {
              diffs.unshift([DIFF_EQUAL, commonprefix]);
            }
            if (commonsuffix) {
              diffs.push([DIFF_EQUAL, commonsuffix]);
            }
            diff_cleanupMerge(diffs);
            if (cursor_pos != null) {
              diffs = fix_cursor(diffs, cursor_pos);
            }
            diffs = fix_emoji(diffs);
            return diffs;
          }
          ;
          function diff_compute_(text1, text2) {
            var diffs;
            if (!text1) {
              return [[DIFF_INSERT, text2]];
            }
            if (!text2) {
              return [[DIFF_DELETE, text1]];
            }
            var longtext = text1.length > text2.length ? text1 : text2;
            var shorttext = text1.length > text2.length ? text2 : text1;
            var i = longtext.indexOf(shorttext);
            if (i != -1) {
              diffs = [
                [DIFF_INSERT, longtext.substring(0, i)],
                [DIFF_EQUAL, shorttext],
                [DIFF_INSERT, longtext.substring(i + shorttext.length)]
              ];
              if (text1.length > text2.length) {
                diffs[0][0] = diffs[2][0] = DIFF_DELETE;
              }
              return diffs;
            }
            if (shorttext.length == 1) {
              return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
            }
            var hm = diff_halfMatch_(text1, text2);
            if (hm) {
              var text1_a = hm[0];
              var text1_b = hm[1];
              var text2_a = hm[2];
              var text2_b = hm[3];
              var mid_common = hm[4];
              var diffs_a = diff_main(text1_a, text2_a);
              var diffs_b = diff_main(text1_b, text2_b);
              return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
            }
            return diff_bisect_(text1, text2);
          }
          ;
          function diff_bisect_(text1, text2) {
            var text1_length = text1.length;
            var text2_length = text2.length;
            var max_d = Math.ceil((text1_length + text2_length) / 2);
            var v_offset = max_d;
            var v_length = 2 * max_d;
            var v1 = new Array(v_length);
            var v2 = new Array(v_length);
            for (var x = 0; x < v_length; x++) {
              v1[x] = -1;
              v2[x] = -1;
            }
            v1[v_offset + 1] = 0;
            v2[v_offset + 1] = 0;
            var delta = text1_length - text2_length;
            var front = delta % 2 != 0;
            var k1start = 0;
            var k1end = 0;
            var k2start = 0;
            var k2end = 0;
            for (var d = 0; d < max_d; d++) {
              for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
                var k1_offset = v_offset + k1;
                var x1;
                if (k1 == -d || k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
                  x1 = v1[k1_offset + 1];
                } else {
                  x1 = v1[k1_offset - 1] + 1;
                }
                var y1 = x1 - k1;
                while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) == text2.charAt(y1)) {
                  x1++;
                  y1++;
                }
                v1[k1_offset] = x1;
                if (x1 > text1_length) {
                  k1end += 2;
                } else if (y1 > text2_length) {
                  k1start += 2;
                } else if (front) {
                  var k2_offset = v_offset + delta - k1;
                  if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
                    var x2 = text1_length - v2[k2_offset];
                    if (x1 >= x2) {
                      return diff_bisectSplit_(text1, text2, x1, y1);
                    }
                  }
                }
              }
              for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
                var k2_offset = v_offset + k2;
                var x2;
                if (k2 == -d || k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
                  x2 = v2[k2_offset + 1];
                } else {
                  x2 = v2[k2_offset - 1] + 1;
                }
                var y2 = x2 - k2;
                while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) == text2.charAt(text2_length - y2 - 1)) {
                  x2++;
                  y2++;
                }
                v2[k2_offset] = x2;
                if (x2 > text1_length) {
                  k2end += 2;
                } else if (y2 > text2_length) {
                  k2start += 2;
                } else if (!front) {
                  var k1_offset = v_offset + delta - k2;
                  if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
                    var x1 = v1[k1_offset];
                    var y1 = v_offset + x1 - k1_offset;
                    x2 = text1_length - x2;
                    if (x1 >= x2) {
                      return diff_bisectSplit_(text1, text2, x1, y1);
                    }
                  }
                }
              }
            }
            return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
          }
          ;
          function diff_bisectSplit_(text1, text2, x, y) {
            var text1a = text1.substring(0, x);
            var text2a = text2.substring(0, y);
            var text1b = text1.substring(x);
            var text2b = text2.substring(y);
            var diffs = diff_main(text1a, text2a);
            var diffsb = diff_main(text1b, text2b);
            return diffs.concat(diffsb);
          }
          ;
          function diff_commonPrefix(text1, text2) {
            if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
              return 0;
            }
            var pointermin = 0;
            var pointermax = Math.min(text1.length, text2.length);
            var pointermid = pointermax;
            var pointerstart = 0;
            while (pointermin < pointermid) {
              if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
                pointermin = pointermid;
                pointerstart = pointermin;
              } else {
                pointermax = pointermid;
              }
              pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
            }
            return pointermid;
          }
          ;
          function diff_commonSuffix(text1, text2) {
            if (!text1 || !text2 || text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
              return 0;
            }
            var pointermin = 0;
            var pointermax = Math.min(text1.length, text2.length);
            var pointermid = pointermax;
            var pointerend = 0;
            while (pointermin < pointermid) {
              if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
                pointermin = pointermid;
                pointerend = pointermin;
              } else {
                pointermax = pointermid;
              }
              pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
            }
            return pointermid;
          }
          ;
          function diff_halfMatch_(text1, text2) {
            var longtext = text1.length > text2.length ? text1 : text2;
            var shorttext = text1.length > text2.length ? text2 : text1;
            if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
              return null;
            }
            function diff_halfMatchI_(longtext2, shorttext2, i) {
              var seed = longtext2.substring(i, i + Math.floor(longtext2.length / 4));
              var j = -1;
              var best_common = "";
              var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
              while ((j = shorttext2.indexOf(seed, j + 1)) != -1) {
                var prefixLength = diff_commonPrefix(longtext2.substring(i), shorttext2.substring(j));
                var suffixLength = diff_commonSuffix(longtext2.substring(0, i), shorttext2.substring(0, j));
                if (best_common.length < suffixLength + prefixLength) {
                  best_common = shorttext2.substring(j - suffixLength, j) + shorttext2.substring(j, j + prefixLength);
                  best_longtext_a = longtext2.substring(0, i - suffixLength);
                  best_longtext_b = longtext2.substring(i + prefixLength);
                  best_shorttext_a = shorttext2.substring(0, j - suffixLength);
                  best_shorttext_b = shorttext2.substring(j + prefixLength);
                }
              }
              if (best_common.length * 2 >= longtext2.length) {
                return [
                  best_longtext_a,
                  best_longtext_b,
                  best_shorttext_a,
                  best_shorttext_b,
                  best_common
                ];
              } else {
                return null;
              }
            }
            var hm1 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 4));
            var hm2 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 2));
            var hm;
            if (!hm1 && !hm2) {
              return null;
            } else if (!hm2) {
              hm = hm1;
            } else if (!hm1) {
              hm = hm2;
            } else {
              hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
            }
            var text1_a, text1_b, text2_a, text2_b;
            if (text1.length > text2.length) {
              text1_a = hm[0];
              text1_b = hm[1];
              text2_a = hm[2];
              text2_b = hm[3];
            } else {
              text2_a = hm[0];
              text2_b = hm[1];
              text1_a = hm[2];
              text1_b = hm[3];
            }
            var mid_common = hm[4];
            return [text1_a, text1_b, text2_a, text2_b, mid_common];
          }
          ;
          function diff_cleanupMerge(diffs) {
            diffs.push([DIFF_EQUAL, ""]);
            var pointer = 0;
            var count_delete = 0;
            var count_insert = 0;
            var text_delete = "";
            var text_insert = "";
            var commonlength;
            while (pointer < diffs.length) {
              switch (diffs[pointer][0]) {
                case DIFF_INSERT:
                  count_insert++;
                  text_insert += diffs[pointer][1];
                  pointer++;
                  break;
                case DIFF_DELETE:
                  count_delete++;
                  text_delete += diffs[pointer][1];
                  pointer++;
                  break;
                case DIFF_EQUAL:
                  if (count_delete + count_insert > 1) {
                    if (count_delete !== 0 && count_insert !== 0) {
                      commonlength = diff_commonPrefix(text_insert, text_delete);
                      if (commonlength !== 0) {
                        if (pointer - count_delete - count_insert > 0 && diffs[pointer - count_delete - count_insert - 1][0] == DIFF_EQUAL) {
                          diffs[pointer - count_delete - count_insert - 1][1] += text_insert.substring(0, commonlength);
                        } else {
                          diffs.splice(0, 0, [
                            DIFF_EQUAL,
                            text_insert.substring(0, commonlength)
                          ]);
                          pointer++;
                        }
                        text_insert = text_insert.substring(commonlength);
                        text_delete = text_delete.substring(commonlength);
                      }
                      commonlength = diff_commonSuffix(text_insert, text_delete);
                      if (commonlength !== 0) {
                        diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
                        text_insert = text_insert.substring(0, text_insert.length - commonlength);
                        text_delete = text_delete.substring(0, text_delete.length - commonlength);
                      }
                    }
                    if (count_delete === 0) {
                      diffs.splice(pointer - count_insert, count_delete + count_insert, [DIFF_INSERT, text_insert]);
                    } else if (count_insert === 0) {
                      diffs.splice(pointer - count_delete, count_delete + count_insert, [DIFF_DELETE, text_delete]);
                    } else {
                      diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert, [DIFF_DELETE, text_delete], [DIFF_INSERT, text_insert]);
                    }
                    pointer = pointer - count_delete - count_insert + (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
                  } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
                    diffs[pointer - 1][1] += diffs[pointer][1];
                    diffs.splice(pointer, 1);
                  } else {
                    pointer++;
                  }
                  count_insert = 0;
                  count_delete = 0;
                  text_delete = "";
                  text_insert = "";
                  break;
              }
            }
            if (diffs[diffs.length - 1][1] === "") {
              diffs.pop();
            }
            var changes = false;
            pointer = 1;
            while (pointer < diffs.length - 1) {
              if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
                if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
                  diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
                  diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
                  diffs.splice(pointer - 1, 1);
                  changes = true;
                } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
                  diffs[pointer - 1][1] += diffs[pointer + 1][1];
                  diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
                  diffs.splice(pointer + 1, 1);
                  changes = true;
                }
              }
              pointer++;
            }
            if (changes) {
              diff_cleanupMerge(diffs);
            }
          }
          ;
          var diff = diff_main;
          diff.INSERT = DIFF_INSERT;
          diff.DELETE = DIFF_DELETE;
          diff.EQUAL = DIFF_EQUAL;
          module2.exports = diff;
          function cursor_normalize_diff(diffs, cursor_pos) {
            if (cursor_pos === 0) {
              return [DIFF_EQUAL, diffs];
            }
            for (var current_pos = 0, i = 0; i < diffs.length; i++) {
              var d = diffs[i];
              if (d[0] === DIFF_DELETE || d[0] === DIFF_EQUAL) {
                var next_pos = current_pos + d[1].length;
                if (cursor_pos === next_pos) {
                  return [i + 1, diffs];
                } else if (cursor_pos < next_pos) {
                  diffs = diffs.slice();
                  var split_pos = cursor_pos - current_pos;
                  var d_left = [d[0], d[1].slice(0, split_pos)];
                  var d_right = [d[0], d[1].slice(split_pos)];
                  diffs.splice(i, 1, d_left, d_right);
                  return [i + 1, diffs];
                } else {
                  current_pos = next_pos;
                }
              }
            }
            throw new Error("cursor_pos is out of bounds!");
          }
          function fix_cursor(diffs, cursor_pos) {
            var norm = cursor_normalize_diff(diffs, cursor_pos);
            var ndiffs = norm[1];
            var cursor_pointer = norm[0];
            var d = ndiffs[cursor_pointer];
            var d_next = ndiffs[cursor_pointer + 1];
            if (d == null) {
              return diffs;
            } else if (d[0] !== DIFF_EQUAL) {
              return diffs;
            } else {
              if (d_next != null && d[1] + d_next[1] === d_next[1] + d[1]) {
                ndiffs.splice(cursor_pointer, 2, d_next, d);
                return merge_tuples(ndiffs, cursor_pointer, 2);
              } else if (d_next != null && d_next[1].indexOf(d[1]) === 0) {
                ndiffs.splice(cursor_pointer, 2, [d_next[0], d[1]], [0, d[1]]);
                var suffix = d_next[1].slice(d[1].length);
                if (suffix.length > 0) {
                  ndiffs.splice(cursor_pointer + 2, 0, [d_next[0], suffix]);
                }
                return merge_tuples(ndiffs, cursor_pointer, 3);
              } else {
                return diffs;
              }
            }
          }
          function fix_emoji(diffs) {
            var compact = false;
            var starts_with_pair_end = function(str) {
              return str.charCodeAt(0) >= 56320 && str.charCodeAt(0) <= 57343;
            };
            var ends_with_pair_start = function(str) {
              return str.charCodeAt(str.length - 1) >= 55296 && str.charCodeAt(str.length - 1) <= 56319;
            };
            for (var i = 2; i < diffs.length; i += 1) {
              if (diffs[i - 2][0] === DIFF_EQUAL && ends_with_pair_start(diffs[i - 2][1]) && diffs[i - 1][0] === DIFF_DELETE && starts_with_pair_end(diffs[i - 1][1]) && diffs[i][0] === DIFF_INSERT && starts_with_pair_end(diffs[i][1])) {
                compact = true;
                diffs[i - 1][1] = diffs[i - 2][1].slice(-1) + diffs[i - 1][1];
                diffs[i][1] = diffs[i - 2][1].slice(-1) + diffs[i][1];
                diffs[i - 2][1] = diffs[i - 2][1].slice(0, -1);
              }
            }
            if (!compact) {
              return diffs;
            }
            var fixed_diffs = [];
            for (var i = 0; i < diffs.length; i += 1) {
              if (diffs[i][1].length > 0) {
                fixed_diffs.push(diffs[i]);
              }
            }
            return fixed_diffs;
          }
          function merge_tuples(diffs, start, length) {
            for (var i = start + length - 1; i >= 0 && i >= start - 1; i--) {
              if (i + 1 < diffs.length) {
                var left_d = diffs[i];
                var right_d = diffs[i + 1];
                if (left_d[0] === right_d[1]) {
                  diffs.splice(i, 2, [left_d[0], left_d[1] + right_d[1]]);
                }
              }
            }
            return diffs;
          }
        },
        function(module2, exports2) {
          exports2 = module2.exports = typeof Object.keys === "function" ? Object.keys : shim;
          exports2.shim = shim;
          function shim(obj) {
            var keys = [];
            for (var key in obj)
              keys.push(key);
            return keys;
          }
        },
        function(module2, exports2) {
          var supportsArgumentsClass = function() {
            return Object.prototype.toString.call(arguments);
          }() == "[object Arguments]";
          exports2 = module2.exports = supportsArgumentsClass ? supported : unsupported;
          exports2.supported = supported;
          function supported(object) {
            return Object.prototype.toString.call(object) == "[object Arguments]";
          }
          ;
          exports2.unsupported = unsupported;
          function unsupported(object) {
            return object && typeof object == "object" && typeof object.length == "number" && Object.prototype.hasOwnProperty.call(object, "callee") && !Object.prototype.propertyIsEnumerable.call(object, "callee") || false;
          }
          ;
        },
        function(module2, exports2) {
          "use strict";
          var has = Object.prototype.hasOwnProperty, prefix = "~";
          function Events() {
          }
          if (Object.create) {
            Events.prototype = /* @__PURE__ */ Object.create(null);
            if (!new Events().__proto__)
              prefix = false;
          }
          function EE(fn, context, once) {
            this.fn = fn;
            this.context = context;
            this.once = once || false;
          }
          function EventEmitter() {
            this._events = new Events();
            this._eventsCount = 0;
          }
          EventEmitter.prototype.eventNames = function eventNames() {
            var names = [], events, name;
            if (this._eventsCount === 0)
              return names;
            for (name in events = this._events) {
              if (has.call(events, name))
                names.push(prefix ? name.slice(1) : name);
            }
            if (Object.getOwnPropertySymbols) {
              return names.concat(Object.getOwnPropertySymbols(events));
            }
            return names;
          };
          EventEmitter.prototype.listeners = function listeners(event, exists) {
            var evt = prefix ? prefix + event : event, available = this._events[evt];
            if (exists)
              return !!available;
            if (!available)
              return [];
            if (available.fn)
              return [available.fn];
            for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
              ee[i] = available[i].fn;
            }
            return ee;
          };
          EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
            var evt = prefix ? prefix + event : event;
            if (!this._events[evt])
              return false;
            var listeners = this._events[evt], len = arguments.length, args, i;
            if (listeners.fn) {
              if (listeners.once)
                this.removeListener(event, listeners.fn, void 0, true);
              switch (len) {
                case 1:
                  return listeners.fn.call(listeners.context), true;
                case 2:
                  return listeners.fn.call(listeners.context, a1), true;
                case 3:
                  return listeners.fn.call(listeners.context, a1, a2), true;
                case 4:
                  return listeners.fn.call(listeners.context, a1, a2, a3), true;
                case 5:
                  return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
                case 6:
                  return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
              }
              for (i = 1, args = new Array(len - 1); i < len; i++) {
                args[i - 1] = arguments[i];
              }
              listeners.fn.apply(listeners.context, args);
            } else {
              var length = listeners.length, j;
              for (i = 0; i < length; i++) {
                if (listeners[i].once)
                  this.removeListener(event, listeners[i].fn, void 0, true);
                switch (len) {
                  case 1:
                    listeners[i].fn.call(listeners[i].context);
                    break;
                  case 2:
                    listeners[i].fn.call(listeners[i].context, a1);
                    break;
                  case 3:
                    listeners[i].fn.call(listeners[i].context, a1, a2);
                    break;
                  case 4:
                    listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                    break;
                  default:
                    if (!args)
                      for (j = 1, args = new Array(len - 1); j < len; j++) {
                        args[j - 1] = arguments[j];
                      }
                    listeners[i].fn.apply(listeners[i].context, args);
                }
              }
            }
            return true;
          };
          EventEmitter.prototype.on = function on(event, fn, context) {
            var listener = new EE(fn, context || this), evt = prefix ? prefix + event : event;
            if (!this._events[evt])
              this._events[evt] = listener, this._eventsCount++;
            else if (!this._events[evt].fn)
              this._events[evt].push(listener);
            else
              this._events[evt] = [this._events[evt], listener];
            return this;
          };
          EventEmitter.prototype.once = function once(event, fn, context) {
            var listener = new EE(fn, context || this, true), evt = prefix ? prefix + event : event;
            if (!this._events[evt])
              this._events[evt] = listener, this._eventsCount++;
            else if (!this._events[evt].fn)
              this._events[evt].push(listener);
            else
              this._events[evt] = [this._events[evt], listener];
            return this;
          };
          EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
            var evt = prefix ? prefix + event : event;
            if (!this._events[evt])
              return this;
            if (!fn) {
              if (--this._eventsCount === 0)
                this._events = new Events();
              else
                delete this._events[evt];
              return this;
            }
            var listeners = this._events[evt];
            if (listeners.fn) {
              if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
                if (--this._eventsCount === 0)
                  this._events = new Events();
                else
                  delete this._events[evt];
              }
            } else {
              for (var i = 0, events = [], length = listeners.length; i < length; i++) {
                if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
                  events.push(listeners[i]);
                }
              }
              if (events.length)
                this._events[evt] = events.length === 1 ? events[0] : events;
              else if (--this._eventsCount === 0)
                this._events = new Events();
              else
                delete this._events[evt];
            }
            return this;
          };
          EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
            var evt;
            if (event) {
              evt = prefix ? prefix + event : event;
              if (this._events[evt]) {
                if (--this._eventsCount === 0)
                  this._events = new Events();
                else
                  delete this._events[evt];
              }
            } else {
              this._events = new Events();
              this._eventsCount = 0;
            }
            return this;
          };
          EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
          EventEmitter.prototype.addListener = EventEmitter.prototype.on;
          EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
            return this;
          };
          EventEmitter.prefixed = prefix;
          EventEmitter.EventEmitter = EventEmitter;
          if ("undefined" !== typeof module2) {
            module2.exports = EventEmitter;
          }
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.matchText = exports2.matchSpacing = exports2.matchNewline = exports2.matchBlot = exports2.matchAttributor = exports2.default = void 0;
          var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
          } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
          var _slicedToArray = function() {
            function sliceIterator(arr, i) {
              var _arr = [];
              var _n = true;
              var _d = false;
              var _e = void 0;
              try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                  _arr.push(_s.value);
                  if (i && _arr.length === i)
                    break;
                }
              } catch (err) {
                _d = true;
                _e = err;
              } finally {
                try {
                  if (!_n && _i["return"])
                    _i["return"]();
                } finally {
                  if (_d)
                    throw _e;
                }
              }
              return _arr;
            }
            return function(arr, i) {
              if (Array.isArray(arr)) {
                return arr;
              } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
              } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
              }
            };
          }();
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _extend2 = __webpack_require__(3);
          var _extend3 = _interopRequireDefault(_extend2);
          var _quillDelta = __webpack_require__(2);
          var _quillDelta2 = _interopRequireDefault(_quillDelta);
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _quill = __webpack_require__(5);
          var _quill2 = _interopRequireDefault(_quill);
          var _logger = __webpack_require__(10);
          var _logger2 = _interopRequireDefault(_logger);
          var _module = __webpack_require__(9);
          var _module2 = _interopRequireDefault(_module);
          var _align = __webpack_require__(36);
          var _background = __webpack_require__(37);
          var _code = __webpack_require__(13);
          var _code2 = _interopRequireDefault(_code);
          var _color = __webpack_require__(26);
          var _direction = __webpack_require__(38);
          var _font = __webpack_require__(39);
          var _size = __webpack_require__(40);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _defineProperty(obj, key, value) {
            if (key in obj) {
              Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
            } else {
              obj[key] = value;
            }
            return obj;
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var debug = (0, _logger2.default)("quill:clipboard");
          var DOM_KEY = "__ql-matcher";
          var CLIPBOARD_CONFIG = [[Node.TEXT_NODE, matchText], [Node.TEXT_NODE, matchNewline], ["br", matchBreak], [Node.ELEMENT_NODE, matchNewline], [Node.ELEMENT_NODE, matchBlot], [Node.ELEMENT_NODE, matchSpacing], [Node.ELEMENT_NODE, matchAttributor], [Node.ELEMENT_NODE, matchStyles], ["li", matchIndent], ["b", matchAlias.bind(matchAlias, "bold")], ["i", matchAlias.bind(matchAlias, "italic")], ["style", matchIgnore]];
          var ATTRIBUTE_ATTRIBUTORS = [_align.AlignAttribute, _direction.DirectionAttribute].reduce(function(memo, attr) {
            memo[attr.keyName] = attr;
            return memo;
          }, {});
          var STYLE_ATTRIBUTORS = [_align.AlignStyle, _background.BackgroundStyle, _color.ColorStyle, _direction.DirectionStyle, _font.FontStyle, _size.SizeStyle].reduce(function(memo, attr) {
            memo[attr.keyName] = attr;
            return memo;
          }, {});
          var Clipboard = function(_Module) {
            _inherits(Clipboard2, _Module);
            function Clipboard2(quill, options) {
              _classCallCheck(this, Clipboard2);
              var _this = _possibleConstructorReturn(this, (Clipboard2.__proto__ || Object.getPrototypeOf(Clipboard2)).call(this, quill, options));
              _this.quill.root.addEventListener("paste", _this.onPaste.bind(_this));
              _this.container = _this.quill.addContainer("ql-clipboard");
              _this.container.setAttribute("contenteditable", true);
              _this.container.setAttribute("tabindex", -1);
              _this.matchers = [];
              CLIPBOARD_CONFIG.concat(_this.options.matchers).forEach(function(_ref) {
                var _ref2 = _slicedToArray(_ref, 2), selector = _ref2[0], matcher = _ref2[1];
                if (!options.matchVisual && matcher === matchSpacing)
                  return;
                _this.addMatcher(selector, matcher);
              });
              return _this;
            }
            _createClass(Clipboard2, [{
              key: "addMatcher",
              value: function addMatcher(selector, matcher) {
                this.matchers.push([selector, matcher]);
              }
            }, {
              key: "convert",
              value: function convert(html) {
                if (typeof html === "string") {
                  this.container.innerHTML = html.replace(/\>\r?\n +\</g, "><");
                  return this.convert();
                }
                var formats = this.quill.getFormat(this.quill.selection.savedRange.index);
                if (formats[_code2.default.blotName]) {
                  var text = this.container.innerText;
                  this.container.innerHTML = "";
                  return new _quillDelta2.default().insert(text, _defineProperty({}, _code2.default.blotName, formats[_code2.default.blotName]));
                }
                var _prepareMatching = this.prepareMatching(), _prepareMatching2 = _slicedToArray(_prepareMatching, 2), elementMatchers = _prepareMatching2[0], textMatchers = _prepareMatching2[1];
                var delta = traverse(this.container, elementMatchers, textMatchers);
                if (deltaEndsWith(delta, "\n") && delta.ops[delta.ops.length - 1].attributes == null) {
                  delta = delta.compose(new _quillDelta2.default().retain(delta.length() - 1).delete(1));
                }
                debug.log("convert", this.container.innerHTML, delta);
                this.container.innerHTML = "";
                return delta;
              }
            }, {
              key: "dangerouslyPasteHTML",
              value: function dangerouslyPasteHTML(index, html) {
                var source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _quill2.default.sources.API;
                if (typeof index === "string") {
                  this.quill.setContents(this.convert(index), html);
                  this.quill.setSelection(0, _quill2.default.sources.SILENT);
                } else {
                  var paste = this.convert(html);
                  this.quill.updateContents(new _quillDelta2.default().retain(index).concat(paste), source);
                  this.quill.setSelection(index + paste.length(), _quill2.default.sources.SILENT);
                }
              }
            }, {
              key: "onPaste",
              value: function onPaste(e) {
                var _this2 = this;
                if (e.defaultPrevented || !this.quill.isEnabled())
                  return;
                var range = this.quill.getSelection();
                var delta = new _quillDelta2.default().retain(range.index);
                var scrollTop = this.quill.scrollingContainer.scrollTop;
                this.container.focus();
                this.quill.selection.update(_quill2.default.sources.SILENT);
                setTimeout(function() {
                  delta = delta.concat(_this2.convert()).delete(range.length);
                  _this2.quill.updateContents(delta, _quill2.default.sources.USER);
                  _this2.quill.setSelection(delta.length() - range.length, _quill2.default.sources.SILENT);
                  _this2.quill.scrollingContainer.scrollTop = scrollTop;
                  _this2.quill.focus();
                }, 1);
              }
            }, {
              key: "prepareMatching",
              value: function prepareMatching() {
                var _this3 = this;
                var elementMatchers = [], textMatchers = [];
                this.matchers.forEach(function(pair) {
                  var _pair = _slicedToArray(pair, 2), selector = _pair[0], matcher = _pair[1];
                  switch (selector) {
                    case Node.TEXT_NODE:
                      textMatchers.push(matcher);
                      break;
                    case Node.ELEMENT_NODE:
                      elementMatchers.push(matcher);
                      break;
                    default:
                      [].forEach.call(_this3.container.querySelectorAll(selector), function(node) {
                        node[DOM_KEY] = node[DOM_KEY] || [];
                        node[DOM_KEY].push(matcher);
                      });
                      break;
                  }
                });
                return [elementMatchers, textMatchers];
              }
            }]);
            return Clipboard2;
          }(_module2.default);
          Clipboard.DEFAULTS = {
            matchers: [],
            matchVisual: true
          };
          function applyFormat(delta, format, value) {
            if ((typeof format === "undefined" ? "undefined" : _typeof(format)) === "object") {
              return Object.keys(format).reduce(function(delta2, key) {
                return applyFormat(delta2, key, format[key]);
              }, delta);
            } else {
              return delta.reduce(function(delta2, op) {
                if (op.attributes && op.attributes[format]) {
                  return delta2.push(op);
                } else {
                  return delta2.insert(op.insert, (0, _extend3.default)({}, _defineProperty({}, format, value), op.attributes));
                }
              }, new _quillDelta2.default());
            }
          }
          function computeStyle(node) {
            if (node.nodeType !== Node.ELEMENT_NODE)
              return {};
            var DOM_KEY2 = "__ql-computed-style";
            return node[DOM_KEY2] || (node[DOM_KEY2] = window.getComputedStyle(node));
          }
          function deltaEndsWith(delta, text) {
            var endText = "";
            for (var i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i) {
              var op = delta.ops[i];
              if (typeof op.insert !== "string")
                break;
              endText = op.insert + endText;
            }
            return endText.slice(-1 * text.length) === text;
          }
          function isLine(node) {
            if (node.childNodes.length === 0)
              return false;
            var style = computeStyle(node);
            return ["block", "list-item"].indexOf(style.display) > -1;
          }
          function traverse(node, elementMatchers, textMatchers) {
            if (node.nodeType === node.TEXT_NODE) {
              return textMatchers.reduce(function(delta, matcher) {
                return matcher(node, delta);
              }, new _quillDelta2.default());
            } else if (node.nodeType === node.ELEMENT_NODE) {
              return [].reduce.call(node.childNodes || [], function(delta, childNode) {
                var childrenDelta = traverse(childNode, elementMatchers, textMatchers);
                if (childNode.nodeType === node.ELEMENT_NODE) {
                  childrenDelta = elementMatchers.reduce(function(childrenDelta2, matcher) {
                    return matcher(childNode, childrenDelta2);
                  }, childrenDelta);
                  childrenDelta = (childNode[DOM_KEY] || []).reduce(function(childrenDelta2, matcher) {
                    return matcher(childNode, childrenDelta2);
                  }, childrenDelta);
                }
                return delta.concat(childrenDelta);
              }, new _quillDelta2.default());
            } else {
              return new _quillDelta2.default();
            }
          }
          function matchAlias(format, node, delta) {
            return applyFormat(delta, format, true);
          }
          function matchAttributor(node, delta) {
            var attributes = _parchment2.default.Attributor.Attribute.keys(node);
            var classes = _parchment2.default.Attributor.Class.keys(node);
            var styles = _parchment2.default.Attributor.Style.keys(node);
            var formats = {};
            attributes.concat(classes).concat(styles).forEach(function(name) {
              var attr = _parchment2.default.query(name, _parchment2.default.Scope.ATTRIBUTE);
              if (attr != null) {
                formats[attr.attrName] = attr.value(node);
                if (formats[attr.attrName])
                  return;
              }
              attr = ATTRIBUTE_ATTRIBUTORS[name];
              if (attr != null && (attr.attrName === name || attr.keyName === name)) {
                formats[attr.attrName] = attr.value(node) || void 0;
              }
              attr = STYLE_ATTRIBUTORS[name];
              if (attr != null && (attr.attrName === name || attr.keyName === name)) {
                attr = STYLE_ATTRIBUTORS[name];
                formats[attr.attrName] = attr.value(node) || void 0;
              }
            });
            if (Object.keys(formats).length > 0) {
              delta = applyFormat(delta, formats);
            }
            return delta;
          }
          function matchBlot(node, delta) {
            var match = _parchment2.default.query(node);
            if (match == null)
              return delta;
            if (match.prototype instanceof _parchment2.default.Embed) {
              var embed = {};
              var value = match.value(node);
              if (value != null) {
                embed[match.blotName] = value;
                delta = new _quillDelta2.default().insert(embed, match.formats(node));
              }
            } else if (typeof match.formats === "function") {
              delta = applyFormat(delta, match.blotName, match.formats(node));
            }
            return delta;
          }
          function matchBreak(node, delta) {
            if (!deltaEndsWith(delta, "\n")) {
              delta.insert("\n");
            }
            return delta;
          }
          function matchIgnore() {
            return new _quillDelta2.default();
          }
          function matchIndent(node, delta) {
            var match = _parchment2.default.query(node);
            if (match == null || match.blotName !== "list-item" || !deltaEndsWith(delta, "\n")) {
              return delta;
            }
            var indent = -1, parent = node.parentNode;
            while (!parent.classList.contains("ql-clipboard")) {
              if ((_parchment2.default.query(parent) || {}).blotName === "list") {
                indent += 1;
              }
              parent = parent.parentNode;
            }
            if (indent <= 0)
              return delta;
            return delta.compose(new _quillDelta2.default().retain(delta.length() - 1).retain(1, { indent }));
          }
          function matchNewline(node, delta) {
            if (!deltaEndsWith(delta, "\n")) {
              if (isLine(node) || delta.length() > 0 && node.nextSibling && isLine(node.nextSibling)) {
                delta.insert("\n");
              }
            }
            return delta;
          }
          function matchSpacing(node, delta) {
            if (isLine(node) && node.nextElementSibling != null && !deltaEndsWith(delta, "\n\n")) {
              var nodeHeight = node.offsetHeight + parseFloat(computeStyle(node).marginTop) + parseFloat(computeStyle(node).marginBottom);
              if (node.nextElementSibling.offsetTop > node.offsetTop + nodeHeight * 1.5) {
                delta.insert("\n");
              }
            }
            return delta;
          }
          function matchStyles(node, delta) {
            var formats = {};
            var style = node.style || {};
            if (style.fontStyle && computeStyle(node).fontStyle === "italic") {
              formats.italic = true;
            }
            if (style.fontWeight && (computeStyle(node).fontWeight.startsWith("bold") || parseInt(computeStyle(node).fontWeight) >= 700)) {
              formats.bold = true;
            }
            if (Object.keys(formats).length > 0) {
              delta = applyFormat(delta, formats);
            }
            if (parseFloat(style.textIndent || 0) > 0) {
              delta = new _quillDelta2.default().insert("	").concat(delta);
            }
            return delta;
          }
          function matchText(node, delta) {
            var text = node.data;
            if (node.parentNode.tagName === "O:P") {
              return delta.insert(text.trim());
            }
            if (text.trim().length === 0 && node.parentNode.classList.contains("ql-clipboard")) {
              return delta;
            }
            if (!computeStyle(node.parentNode).whiteSpace.startsWith("pre")) {
              var replacer = function replacer2(collapse, match) {
                match = match.replace(/[^\u00a0]/g, "");
                return match.length < 1 && collapse ? " " : match;
              };
              text = text.replace(/\r\n/g, " ").replace(/\n/g, " ");
              text = text.replace(/\s\s+/g, replacer.bind(replacer, true));
              if (node.previousSibling == null && isLine(node.parentNode) || node.previousSibling != null && isLine(node.previousSibling)) {
                text = text.replace(/^\s+/, replacer.bind(replacer, false));
              }
              if (node.nextSibling == null && isLine(node.parentNode) || node.nextSibling != null && isLine(node.nextSibling)) {
                text = text.replace(/\s+$/, replacer.bind(replacer, false));
              }
            }
            return delta.insert(text);
          }
          exports2.default = Clipboard;
          exports2.matchAttributor = matchAttributor;
          exports2.matchBlot = matchBlot;
          exports2.matchNewline = matchNewline;
          exports2.matchSpacing = matchSpacing;
          exports2.matchText = matchText;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _inline = __webpack_require__(6);
          var _inline2 = _interopRequireDefault(_inline);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var Bold = function(_Inline) {
            _inherits(Bold2, _Inline);
            function Bold2() {
              _classCallCheck(this, Bold2);
              return _possibleConstructorReturn(this, (Bold2.__proto__ || Object.getPrototypeOf(Bold2)).apply(this, arguments));
            }
            _createClass(Bold2, [{
              key: "optimize",
              value: function optimize(context) {
                _get(Bold2.prototype.__proto__ || Object.getPrototypeOf(Bold2.prototype), "optimize", this).call(this, context);
                if (this.domNode.tagName !== this.statics.tagName[0]) {
                  this.replaceWith(this.statics.blotName);
                }
              }
            }], [{
              key: "create",
              value: function create() {
                return _get(Bold2.__proto__ || Object.getPrototypeOf(Bold2), "create", this).call(this);
              }
            }, {
              key: "formats",
              value: function formats() {
                return true;
              }
            }]);
            return Bold2;
          }(_inline2.default);
          Bold.blotName = "bold";
          Bold.tagName = ["STRONG", "B"];
          exports2.default = Bold;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.addControls = exports2.default = void 0;
          var _slicedToArray = function() {
            function sliceIterator(arr, i) {
              var _arr = [];
              var _n = true;
              var _d = false;
              var _e = void 0;
              try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                  _arr.push(_s.value);
                  if (i && _arr.length === i)
                    break;
                }
              } catch (err) {
                _d = true;
                _e = err;
              } finally {
                try {
                  if (!_n && _i["return"])
                    _i["return"]();
                } finally {
                  if (_d)
                    throw _e;
                }
              }
              return _arr;
            }
            return function(arr, i) {
              if (Array.isArray(arr)) {
                return arr;
              } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
              } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
              }
            };
          }();
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _quillDelta = __webpack_require__(2);
          var _quillDelta2 = _interopRequireDefault(_quillDelta);
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _quill = __webpack_require__(5);
          var _quill2 = _interopRequireDefault(_quill);
          var _logger = __webpack_require__(10);
          var _logger2 = _interopRequireDefault(_logger);
          var _module = __webpack_require__(9);
          var _module2 = _interopRequireDefault(_module);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _defineProperty(obj, key, value) {
            if (key in obj) {
              Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
            } else {
              obj[key] = value;
            }
            return obj;
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var debug = (0, _logger2.default)("quill:toolbar");
          var Toolbar = function(_Module) {
            _inherits(Toolbar2, _Module);
            function Toolbar2(quill, options) {
              _classCallCheck(this, Toolbar2);
              var _this = _possibleConstructorReturn(this, (Toolbar2.__proto__ || Object.getPrototypeOf(Toolbar2)).call(this, quill, options));
              if (Array.isArray(_this.options.container)) {
                var container = document.createElement("div");
                addControls(container, _this.options.container);
                quill.container.parentNode.insertBefore(container, quill.container);
                _this.container = container;
              } else if (typeof _this.options.container === "string") {
                _this.container = document.querySelector(_this.options.container);
              } else {
                _this.container = _this.options.container;
              }
              if (!(_this.container instanceof HTMLElement)) {
                var _ret;
                return _ret = debug.error("Container required for toolbar", _this.options), _possibleConstructorReturn(_this, _ret);
              }
              _this.container.classList.add("ql-toolbar");
              _this.controls = [];
              _this.handlers = {};
              Object.keys(_this.options.handlers).forEach(function(format) {
                _this.addHandler(format, _this.options.handlers[format]);
              });
              [].forEach.call(_this.container.querySelectorAll("button, select"), function(input) {
                _this.attach(input);
              });
              _this.quill.on(_quill2.default.events.EDITOR_CHANGE, function(type, range) {
                if (type === _quill2.default.events.SELECTION_CHANGE) {
                  _this.update(range);
                }
              });
              _this.quill.on(_quill2.default.events.SCROLL_OPTIMIZE, function() {
                var _this$quill$selection = _this.quill.selection.getRange(), _this$quill$selection2 = _slicedToArray(_this$quill$selection, 1), range = _this$quill$selection2[0];
                _this.update(range);
              });
              return _this;
            }
            _createClass(Toolbar2, [{
              key: "addHandler",
              value: function addHandler(format, handler) {
                this.handlers[format] = handler;
              }
            }, {
              key: "attach",
              value: function attach(input) {
                var _this2 = this;
                var format = [].find.call(input.classList, function(className) {
                  return className.indexOf("ql-") === 0;
                });
                if (!format)
                  return;
                format = format.slice("ql-".length);
                if (input.tagName === "BUTTON") {
                  input.setAttribute("type", "button");
                }
                if (this.handlers[format] == null) {
                  if (this.quill.scroll.whitelist != null && this.quill.scroll.whitelist[format] == null) {
                    debug.warn("ignoring attaching to disabled format", format, input);
                    return;
                  }
                  if (_parchment2.default.query(format) == null) {
                    debug.warn("ignoring attaching to nonexistent format", format, input);
                    return;
                  }
                }
                var eventName = input.tagName === "SELECT" ? "change" : "click";
                input.addEventListener(eventName, function(e) {
                  var value = void 0;
                  if (input.tagName === "SELECT") {
                    if (input.selectedIndex < 0)
                      return;
                    var selected = input.options[input.selectedIndex];
                    if (selected.hasAttribute("selected")) {
                      value = false;
                    } else {
                      value = selected.value || false;
                    }
                  } else {
                    if (input.classList.contains("ql-active")) {
                      value = false;
                    } else {
                      value = input.value || !input.hasAttribute("value");
                    }
                    e.preventDefault();
                  }
                  _this2.quill.focus();
                  var _quill$selection$getR = _this2.quill.selection.getRange(), _quill$selection$getR2 = _slicedToArray(_quill$selection$getR, 1), range = _quill$selection$getR2[0];
                  if (_this2.handlers[format] != null) {
                    _this2.handlers[format].call(_this2, value);
                  } else if (_parchment2.default.query(format).prototype instanceof _parchment2.default.Embed) {
                    value = prompt("Enter " + format);
                    if (!value)
                      return;
                    _this2.quill.updateContents(new _quillDelta2.default().retain(range.index).delete(range.length).insert(_defineProperty({}, format, value)), _quill2.default.sources.USER);
                  } else {
                    _this2.quill.format(format, value, _quill2.default.sources.USER);
                  }
                  _this2.update(range);
                });
                this.controls.push([format, input]);
              }
            }, {
              key: "update",
              value: function update(range) {
                var formats = range == null ? {} : this.quill.getFormat(range);
                this.controls.forEach(function(pair) {
                  var _pair = _slicedToArray(pair, 2), format = _pair[0], input = _pair[1];
                  if (input.tagName === "SELECT") {
                    var option = void 0;
                    if (range == null) {
                      option = null;
                    } else if (formats[format] == null) {
                      option = input.querySelector("option[selected]");
                    } else if (!Array.isArray(formats[format])) {
                      var value = formats[format];
                      if (typeof value === "string") {
                        value = value.replace(/\"/g, '\\"');
                      }
                      option = input.querySelector('option[value="' + value + '"]');
                    }
                    if (option == null) {
                      input.value = "";
                      input.selectedIndex = -1;
                    } else {
                      option.selected = true;
                    }
                  } else {
                    if (range == null) {
                      input.classList.remove("ql-active");
                    } else if (input.hasAttribute("value")) {
                      var isActive = formats[format] === input.getAttribute("value") || formats[format] != null && formats[format].toString() === input.getAttribute("value") || formats[format] == null && !input.getAttribute("value");
                      input.classList.toggle("ql-active", isActive);
                    } else {
                      input.classList.toggle("ql-active", formats[format] != null);
                    }
                  }
                });
              }
            }]);
            return Toolbar2;
          }(_module2.default);
          Toolbar.DEFAULTS = {};
          function addButton(container, format, value) {
            var input = document.createElement("button");
            input.setAttribute("type", "button");
            input.classList.add("ql-" + format);
            if (value != null) {
              input.value = value;
            }
            container.appendChild(input);
          }
          function addControls(container, groups) {
            if (!Array.isArray(groups[0])) {
              groups = [groups];
            }
            groups.forEach(function(controls) {
              var group = document.createElement("span");
              group.classList.add("ql-formats");
              controls.forEach(function(control) {
                if (typeof control === "string") {
                  addButton(group, control);
                } else {
                  var format = Object.keys(control)[0];
                  var value = control[format];
                  if (Array.isArray(value)) {
                    addSelect(group, format, value);
                  } else {
                    addButton(group, format, value);
                  }
                }
              });
              container.appendChild(group);
            });
          }
          function addSelect(container, format, values) {
            var input = document.createElement("select");
            input.classList.add("ql-" + format);
            values.forEach(function(value) {
              var option = document.createElement("option");
              if (value !== false) {
                option.setAttribute("value", value);
              } else {
                option.setAttribute("selected", "selected");
              }
              input.appendChild(option);
            });
            container.appendChild(input);
          }
          Toolbar.DEFAULTS = {
            container: null,
            handlers: {
              clean: function clean() {
                var _this3 = this;
                var range = this.quill.getSelection();
                if (range == null)
                  return;
                if (range.length == 0) {
                  var formats = this.quill.getFormat();
                  Object.keys(formats).forEach(function(name) {
                    if (_parchment2.default.query(name, _parchment2.default.Scope.INLINE) != null) {
                      _this3.quill.format(name, false);
                    }
                  });
                } else {
                  this.quill.removeFormat(range, _quill2.default.sources.USER);
                }
              },
              direction: function direction(value) {
                var align = this.quill.getFormat()["align"];
                if (value === "rtl" && align == null) {
                  this.quill.format("align", "right", _quill2.default.sources.USER);
                } else if (!value && align === "right") {
                  this.quill.format("align", false, _quill2.default.sources.USER);
                }
                this.quill.format("direction", value, _quill2.default.sources.USER);
              },
              indent: function indent(value) {
                var range = this.quill.getSelection();
                var formats = this.quill.getFormat(range);
                var indent2 = parseInt(formats.indent || 0);
                if (value === "+1" || value === "-1") {
                  var modifier = value === "+1" ? 1 : -1;
                  if (formats.direction === "rtl")
                    modifier *= -1;
                  this.quill.format("indent", indent2 + modifier, _quill2.default.sources.USER);
                }
              },
              link: function link(value) {
                if (value === true) {
                  value = prompt("Enter link URL:");
                }
                this.quill.format("link", value, _quill2.default.sources.USER);
              },
              list: function list(value) {
                var range = this.quill.getSelection();
                var formats = this.quill.getFormat(range);
                if (value === "check") {
                  if (formats["list"] === "checked" || formats["list"] === "unchecked") {
                    this.quill.format("list", false, _quill2.default.sources.USER);
                  } else {
                    this.quill.format("list", "unchecked", _quill2.default.sources.USER);
                  }
                } else {
                  this.quill.format("list", value, _quill2.default.sources.USER);
                }
              }
            }
          };
          exports2.default = Toolbar;
          exports2.addControls = addControls;
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"></polyline> <polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"></polyline> <line class=ql-stroke x1=10 x2=8 y1=5 y2=13></line> </svg>';
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _picker = __webpack_require__(28);
          var _picker2 = _interopRequireDefault(_picker);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var ColorPicker = function(_Picker) {
            _inherits(ColorPicker2, _Picker);
            function ColorPicker2(select, label) {
              _classCallCheck(this, ColorPicker2);
              var _this = _possibleConstructorReturn(this, (ColorPicker2.__proto__ || Object.getPrototypeOf(ColorPicker2)).call(this, select));
              _this.label.innerHTML = label;
              _this.container.classList.add("ql-color-picker");
              [].slice.call(_this.container.querySelectorAll(".ql-picker-item"), 0, 7).forEach(function(item) {
                item.classList.add("ql-primary");
              });
              return _this;
            }
            _createClass(ColorPicker2, [{
              key: "buildItem",
              value: function buildItem(option) {
                var item = _get(ColorPicker2.prototype.__proto__ || Object.getPrototypeOf(ColorPicker2.prototype), "buildItem", this).call(this, option);
                item.style.backgroundColor = option.getAttribute("value") || "";
                return item;
              }
            }, {
              key: "selectItem",
              value: function selectItem(item, trigger) {
                _get(ColorPicker2.prototype.__proto__ || Object.getPrototypeOf(ColorPicker2.prototype), "selectItem", this).call(this, item, trigger);
                var colorLabel = this.label.querySelector(".ql-color-label");
                var value = item ? item.getAttribute("data-value") || "" : "";
                if (colorLabel) {
                  if (colorLabel.tagName === "line") {
                    colorLabel.style.stroke = value;
                  } else {
                    colorLabel.style.fill = value;
                  }
                }
              }
            }]);
            return ColorPicker2;
          }(_picker2.default);
          exports2.default = ColorPicker;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _picker = __webpack_require__(28);
          var _picker2 = _interopRequireDefault(_picker);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var IconPicker = function(_Picker) {
            _inherits(IconPicker2, _Picker);
            function IconPicker2(select, icons) {
              _classCallCheck(this, IconPicker2);
              var _this = _possibleConstructorReturn(this, (IconPicker2.__proto__ || Object.getPrototypeOf(IconPicker2)).call(this, select));
              _this.container.classList.add("ql-icon-picker");
              [].forEach.call(_this.container.querySelectorAll(".ql-picker-item"), function(item) {
                item.innerHTML = icons[item.getAttribute("data-value") || ""];
              });
              _this.defaultItem = _this.container.querySelector(".ql-selected");
              _this.selectItem(_this.defaultItem);
              return _this;
            }
            _createClass(IconPicker2, [{
              key: "selectItem",
              value: function selectItem(item, trigger) {
                _get(IconPicker2.prototype.__proto__ || Object.getPrototypeOf(IconPicker2.prototype), "selectItem", this).call(this, item, trigger);
                item = item || this.defaultItem;
                this.label.innerHTML = item.innerHTML;
              }
            }]);
            return IconPicker2;
          }(_picker2.default);
          exports2.default = IconPicker;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          var Tooltip = function() {
            function Tooltip2(quill, boundsContainer) {
              var _this = this;
              _classCallCheck(this, Tooltip2);
              this.quill = quill;
              this.boundsContainer = boundsContainer || document.body;
              this.root = quill.addContainer("ql-tooltip");
              this.root.innerHTML = this.constructor.TEMPLATE;
              if (this.quill.root === this.quill.scrollingContainer) {
                this.quill.root.addEventListener("scroll", function() {
                  _this.root.style.marginTop = -1 * _this.quill.root.scrollTop + "px";
                });
              }
              this.hide();
            }
            _createClass(Tooltip2, [{
              key: "hide",
              value: function hide() {
                this.root.classList.add("ql-hidden");
              }
            }, {
              key: "position",
              value: function position(reference) {
                var left = reference.left + reference.width / 2 - this.root.offsetWidth / 2;
                var top = reference.bottom + this.quill.root.scrollTop;
                this.root.style.left = left + "px";
                this.root.style.top = top + "px";
                this.root.classList.remove("ql-flip");
                var containerBounds = this.boundsContainer.getBoundingClientRect();
                var rootBounds = this.root.getBoundingClientRect();
                var shift = 0;
                if (rootBounds.right > containerBounds.right) {
                  shift = containerBounds.right - rootBounds.right;
                  this.root.style.left = left + shift + "px";
                }
                if (rootBounds.left < containerBounds.left) {
                  shift = containerBounds.left - rootBounds.left;
                  this.root.style.left = left + shift + "px";
                }
                if (rootBounds.bottom > containerBounds.bottom) {
                  var height = rootBounds.bottom - rootBounds.top;
                  var verticalShift = reference.bottom - reference.top + height;
                  this.root.style.top = top - verticalShift + "px";
                  this.root.classList.add("ql-flip");
                }
                return shift;
              }
            }, {
              key: "show",
              value: function show() {
                this.root.classList.remove("ql-editing");
                this.root.classList.remove("ql-hidden");
              }
            }]);
            return Tooltip2;
          }();
          exports2.default = Tooltip;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _slicedToArray = function() {
            function sliceIterator(arr, i) {
              var _arr = [];
              var _n = true;
              var _d = false;
              var _e = void 0;
              try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                  _arr.push(_s.value);
                  if (i && _arr.length === i)
                    break;
                }
              } catch (err) {
                _d = true;
                _e = err;
              } finally {
                try {
                  if (!_n && _i["return"])
                    _i["return"]();
                } finally {
                  if (_d)
                    throw _e;
                }
              }
              return _arr;
            }
            return function(arr, i) {
              if (Array.isArray(arr)) {
                return arr;
              } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
              } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
              }
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _extend = __webpack_require__(3);
          var _extend2 = _interopRequireDefault(_extend);
          var _emitter = __webpack_require__(8);
          var _emitter2 = _interopRequireDefault(_emitter);
          var _base = __webpack_require__(43);
          var _base2 = _interopRequireDefault(_base);
          var _link = __webpack_require__(27);
          var _link2 = _interopRequireDefault(_link);
          var _selection = __webpack_require__(15);
          var _icons = __webpack_require__(41);
          var _icons2 = _interopRequireDefault(_icons);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var TOOLBAR_CONFIG = [[{ header: ["1", "2", "3", false] }], ["bold", "italic", "underline", "link"], [{ list: "ordered" }, { list: "bullet" }], ["clean"]];
          var SnowTheme = function(_BaseTheme) {
            _inherits(SnowTheme2, _BaseTheme);
            function SnowTheme2(quill, options) {
              _classCallCheck(this, SnowTheme2);
              if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
                options.modules.toolbar.container = TOOLBAR_CONFIG;
              }
              var _this = _possibleConstructorReturn(this, (SnowTheme2.__proto__ || Object.getPrototypeOf(SnowTheme2)).call(this, quill, options));
              _this.quill.container.classList.add("ql-snow");
              return _this;
            }
            _createClass(SnowTheme2, [{
              key: "extendToolbar",
              value: function extendToolbar(toolbar) {
                toolbar.container.classList.add("ql-snow");
                this.buildButtons([].slice.call(toolbar.container.querySelectorAll("button")), _icons2.default);
                this.buildPickers([].slice.call(toolbar.container.querySelectorAll("select")), _icons2.default);
                this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
                if (toolbar.container.querySelector(".ql-link")) {
                  this.quill.keyboard.addBinding({ key: "K", shortKey: true }, function(range, context) {
                    toolbar.handlers["link"].call(toolbar, !context.format.link);
                  });
                }
              }
            }]);
            return SnowTheme2;
          }(_base2.default);
          SnowTheme.DEFAULTS = (0, _extend2.default)(true, {}, _base2.default.DEFAULTS, {
            modules: {
              toolbar: {
                handlers: {
                  link: function link(value) {
                    if (value) {
                      var range = this.quill.getSelection();
                      if (range == null || range.length == 0)
                        return;
                      var preview = this.quill.getText(range);
                      if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf("mailto:") !== 0) {
                        preview = "mailto:" + preview;
                      }
                      var tooltip = this.quill.theme.tooltip;
                      tooltip.edit("link", preview);
                    } else {
                      this.quill.format("link", false);
                    }
                  }
                }
              }
            }
          });
          var SnowTooltip = function(_BaseTooltip) {
            _inherits(SnowTooltip2, _BaseTooltip);
            function SnowTooltip2(quill, bounds) {
              _classCallCheck(this, SnowTooltip2);
              var _this2 = _possibleConstructorReturn(this, (SnowTooltip2.__proto__ || Object.getPrototypeOf(SnowTooltip2)).call(this, quill, bounds));
              _this2.preview = _this2.root.querySelector("a.ql-preview");
              return _this2;
            }
            _createClass(SnowTooltip2, [{
              key: "listen",
              value: function listen() {
                var _this3 = this;
                _get(SnowTooltip2.prototype.__proto__ || Object.getPrototypeOf(SnowTooltip2.prototype), "listen", this).call(this);
                this.root.querySelector("a.ql-action").addEventListener("click", function(event) {
                  if (_this3.root.classList.contains("ql-editing")) {
                    _this3.save();
                  } else {
                    _this3.edit("link", _this3.preview.textContent);
                  }
                  event.preventDefault();
                });
                this.root.querySelector("a.ql-remove").addEventListener("click", function(event) {
                  if (_this3.linkRange != null) {
                    var range = _this3.linkRange;
                    _this3.restoreFocus();
                    _this3.quill.formatText(range, "link", false, _emitter2.default.sources.USER);
                    delete _this3.linkRange;
                  }
                  event.preventDefault();
                  _this3.hide();
                });
                this.quill.on(_emitter2.default.events.SELECTION_CHANGE, function(range, oldRange, source) {
                  if (range == null)
                    return;
                  if (range.length === 0 && source === _emitter2.default.sources.USER) {
                    var _quill$scroll$descend = _this3.quill.scroll.descendant(_link2.default, range.index), _quill$scroll$descend2 = _slicedToArray(_quill$scroll$descend, 2), link = _quill$scroll$descend2[0], offset = _quill$scroll$descend2[1];
                    if (link != null) {
                      _this3.linkRange = new _selection.Range(range.index - offset, link.length());
                      var preview = _link2.default.formats(link.domNode);
                      _this3.preview.textContent = preview;
                      _this3.preview.setAttribute("href", preview);
                      _this3.show();
                      _this3.position(_this3.quill.getBounds(_this3.linkRange));
                      return;
                    }
                  } else {
                    delete _this3.linkRange;
                  }
                  _this3.hide();
                });
              }
            }, {
              key: "show",
              value: function show() {
                _get(SnowTooltip2.prototype.__proto__ || Object.getPrototypeOf(SnowTooltip2.prototype), "show", this).call(this);
                this.root.removeAttribute("data-mode");
              }
            }]);
            return SnowTooltip2;
          }(_base.BaseTooltip);
          SnowTooltip.TEMPLATE = ['<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join("");
          exports2.default = SnowTheme;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _core = __webpack_require__(29);
          var _core2 = _interopRequireDefault(_core);
          var _align = __webpack_require__(36);
          var _direction = __webpack_require__(38);
          var _indent = __webpack_require__(64);
          var _blockquote = __webpack_require__(65);
          var _blockquote2 = _interopRequireDefault(_blockquote);
          var _header = __webpack_require__(66);
          var _header2 = _interopRequireDefault(_header);
          var _list = __webpack_require__(67);
          var _list2 = _interopRequireDefault(_list);
          var _background = __webpack_require__(37);
          var _color = __webpack_require__(26);
          var _font = __webpack_require__(39);
          var _size = __webpack_require__(40);
          var _bold = __webpack_require__(56);
          var _bold2 = _interopRequireDefault(_bold);
          var _italic = __webpack_require__(68);
          var _italic2 = _interopRequireDefault(_italic);
          var _link = __webpack_require__(27);
          var _link2 = _interopRequireDefault(_link);
          var _script = __webpack_require__(69);
          var _script2 = _interopRequireDefault(_script);
          var _strike = __webpack_require__(70);
          var _strike2 = _interopRequireDefault(_strike);
          var _underline = __webpack_require__(71);
          var _underline2 = _interopRequireDefault(_underline);
          var _image = __webpack_require__(72);
          var _image2 = _interopRequireDefault(_image);
          var _video = __webpack_require__(73);
          var _video2 = _interopRequireDefault(_video);
          var _code = __webpack_require__(13);
          var _code2 = _interopRequireDefault(_code);
          var _formula = __webpack_require__(74);
          var _formula2 = _interopRequireDefault(_formula);
          var _syntax = __webpack_require__(75);
          var _syntax2 = _interopRequireDefault(_syntax);
          var _toolbar = __webpack_require__(57);
          var _toolbar2 = _interopRequireDefault(_toolbar);
          var _icons = __webpack_require__(41);
          var _icons2 = _interopRequireDefault(_icons);
          var _picker = __webpack_require__(28);
          var _picker2 = _interopRequireDefault(_picker);
          var _colorPicker = __webpack_require__(59);
          var _colorPicker2 = _interopRequireDefault(_colorPicker);
          var _iconPicker = __webpack_require__(60);
          var _iconPicker2 = _interopRequireDefault(_iconPicker);
          var _tooltip = __webpack_require__(61);
          var _tooltip2 = _interopRequireDefault(_tooltip);
          var _bubble = __webpack_require__(108);
          var _bubble2 = _interopRequireDefault(_bubble);
          var _snow = __webpack_require__(62);
          var _snow2 = _interopRequireDefault(_snow);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          _core2.default.register({
            "attributors/attribute/direction": _direction.DirectionAttribute,
            "attributors/class/align": _align.AlignClass,
            "attributors/class/background": _background.BackgroundClass,
            "attributors/class/color": _color.ColorClass,
            "attributors/class/direction": _direction.DirectionClass,
            "attributors/class/font": _font.FontClass,
            "attributors/class/size": _size.SizeClass,
            "attributors/style/align": _align.AlignStyle,
            "attributors/style/background": _background.BackgroundStyle,
            "attributors/style/color": _color.ColorStyle,
            "attributors/style/direction": _direction.DirectionStyle,
            "attributors/style/font": _font.FontStyle,
            "attributors/style/size": _size.SizeStyle
          }, true);
          _core2.default.register({
            "formats/align": _align.AlignClass,
            "formats/direction": _direction.DirectionClass,
            "formats/indent": _indent.IndentClass,
            "formats/background": _background.BackgroundStyle,
            "formats/color": _color.ColorStyle,
            "formats/font": _font.FontClass,
            "formats/size": _size.SizeClass,
            "formats/blockquote": _blockquote2.default,
            "formats/code-block": _code2.default,
            "formats/header": _header2.default,
            "formats/list": _list2.default,
            "formats/bold": _bold2.default,
            "formats/code": _code.Code,
            "formats/italic": _italic2.default,
            "formats/link": _link2.default,
            "formats/script": _script2.default,
            "formats/strike": _strike2.default,
            "formats/underline": _underline2.default,
            "formats/image": _image2.default,
            "formats/video": _video2.default,
            "formats/list/item": _list.ListItem,
            "modules/formula": _formula2.default,
            "modules/syntax": _syntax2.default,
            "modules/toolbar": _toolbar2.default,
            "themes/bubble": _bubble2.default,
            "themes/snow": _snow2.default,
            "ui/icons": _icons2.default,
            "ui/picker": _picker2.default,
            "ui/icon-picker": _iconPicker2.default,
            "ui/color-picker": _colorPicker2.default,
            "ui/tooltip": _tooltip2.default
          }, true);
          exports2.default = _core2.default;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.IndentClass = void 0;
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var IdentAttributor = function(_Parchment$Attributor) {
            _inherits(IdentAttributor2, _Parchment$Attributor);
            function IdentAttributor2() {
              _classCallCheck(this, IdentAttributor2);
              return _possibleConstructorReturn(this, (IdentAttributor2.__proto__ || Object.getPrototypeOf(IdentAttributor2)).apply(this, arguments));
            }
            _createClass(IdentAttributor2, [{
              key: "add",
              value: function add(node, value) {
                if (value === "+1" || value === "-1") {
                  var indent = this.value(node) || 0;
                  value = value === "+1" ? indent + 1 : indent - 1;
                }
                if (value === 0) {
                  this.remove(node);
                  return true;
                } else {
                  return _get(IdentAttributor2.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor2.prototype), "add", this).call(this, node, value);
                }
              }
            }, {
              key: "canAdd",
              value: function canAdd(node, value) {
                return _get(IdentAttributor2.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor2.prototype), "canAdd", this).call(this, node, value) || _get(IdentAttributor2.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor2.prototype), "canAdd", this).call(this, node, parseInt(value));
              }
            }, {
              key: "value",
              value: function value(node) {
                return parseInt(_get(IdentAttributor2.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor2.prototype), "value", this).call(this, node)) || void 0;
              }
            }]);
            return IdentAttributor2;
          }(_parchment2.default.Attributor.Class);
          var IndentClass = new IdentAttributor("indent", "ql-indent", {
            scope: _parchment2.default.Scope.BLOCK,
            whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
          });
          exports2.IndentClass = IndentClass;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _block = __webpack_require__(4);
          var _block2 = _interopRequireDefault(_block);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var Blockquote = function(_Block) {
            _inherits(Blockquote2, _Block);
            function Blockquote2() {
              _classCallCheck(this, Blockquote2);
              return _possibleConstructorReturn(this, (Blockquote2.__proto__ || Object.getPrototypeOf(Blockquote2)).apply(this, arguments));
            }
            return Blockquote2;
          }(_block2.default);
          Blockquote.blotName = "blockquote";
          Blockquote.tagName = "blockquote";
          exports2.default = Blockquote;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _block = __webpack_require__(4);
          var _block2 = _interopRequireDefault(_block);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var Header = function(_Block) {
            _inherits(Header2, _Block);
            function Header2() {
              _classCallCheck(this, Header2);
              return _possibleConstructorReturn(this, (Header2.__proto__ || Object.getPrototypeOf(Header2)).apply(this, arguments));
            }
            _createClass(Header2, null, [{
              key: "formats",
              value: function formats(domNode) {
                return this.tagName.indexOf(domNode.tagName) + 1;
              }
            }]);
            return Header2;
          }(_block2.default);
          Header.blotName = "header";
          Header.tagName = ["H1", "H2", "H3", "H4", "H5", "H6"];
          exports2.default = Header;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.default = exports2.ListItem = void 0;
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _block = __webpack_require__(4);
          var _block2 = _interopRequireDefault(_block);
          var _container = __webpack_require__(25);
          var _container2 = _interopRequireDefault(_container);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _defineProperty(obj, key, value) {
            if (key in obj) {
              Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
            } else {
              obj[key] = value;
            }
            return obj;
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var ListItem = function(_Block) {
            _inherits(ListItem2, _Block);
            function ListItem2() {
              _classCallCheck(this, ListItem2);
              return _possibleConstructorReturn(this, (ListItem2.__proto__ || Object.getPrototypeOf(ListItem2)).apply(this, arguments));
            }
            _createClass(ListItem2, [{
              key: "format",
              value: function format(name, value) {
                if (name === List.blotName && !value) {
                  this.replaceWith(_parchment2.default.create(this.statics.scope));
                } else {
                  _get(ListItem2.prototype.__proto__ || Object.getPrototypeOf(ListItem2.prototype), "format", this).call(this, name, value);
                }
              }
            }, {
              key: "remove",
              value: function remove() {
                if (this.prev == null && this.next == null) {
                  this.parent.remove();
                } else {
                  _get(ListItem2.prototype.__proto__ || Object.getPrototypeOf(ListItem2.prototype), "remove", this).call(this);
                }
              }
            }, {
              key: "replaceWith",
              value: function replaceWith(name, value) {
                this.parent.isolate(this.offset(this.parent), this.length());
                if (name === this.parent.statics.blotName) {
                  this.parent.replaceWith(name, value);
                  return this;
                } else {
                  this.parent.unwrap();
                  return _get(ListItem2.prototype.__proto__ || Object.getPrototypeOf(ListItem2.prototype), "replaceWith", this).call(this, name, value);
                }
              }
            }], [{
              key: "formats",
              value: function formats(domNode) {
                return domNode.tagName === this.tagName ? void 0 : _get(ListItem2.__proto__ || Object.getPrototypeOf(ListItem2), "formats", this).call(this, domNode);
              }
            }]);
            return ListItem2;
          }(_block2.default);
          ListItem.blotName = "list-item";
          ListItem.tagName = "LI";
          var List = function(_Container) {
            _inherits(List2, _Container);
            _createClass(List2, null, [{
              key: "create",
              value: function create(value) {
                var tagName = value === "ordered" ? "OL" : "UL";
                var node = _get(List2.__proto__ || Object.getPrototypeOf(List2), "create", this).call(this, tagName);
                if (value === "checked" || value === "unchecked") {
                  node.setAttribute("data-checked", value === "checked");
                }
                return node;
              }
            }, {
              key: "formats",
              value: function formats(domNode) {
                if (domNode.tagName === "OL")
                  return "ordered";
                if (domNode.tagName === "UL") {
                  if (domNode.hasAttribute("data-checked")) {
                    return domNode.getAttribute("data-checked") === "true" ? "checked" : "unchecked";
                  } else {
                    return "bullet";
                  }
                }
                return void 0;
              }
            }]);
            function List2(domNode) {
              _classCallCheck(this, List2);
              var _this2 = _possibleConstructorReturn(this, (List2.__proto__ || Object.getPrototypeOf(List2)).call(this, domNode));
              var listEventHandler = function listEventHandler2(e) {
                if (e.target.parentNode !== domNode)
                  return;
                var format = _this2.statics.formats(domNode);
                var blot = _parchment2.default.find(e.target);
                if (format === "checked") {
                  blot.format("list", "unchecked");
                } else if (format === "unchecked") {
                  blot.format("list", "checked");
                }
              };
              domNode.addEventListener("touchstart", listEventHandler);
              domNode.addEventListener("mousedown", listEventHandler);
              return _this2;
            }
            _createClass(List2, [{
              key: "format",
              value: function format(name, value) {
                if (this.children.length > 0) {
                  this.children.tail.format(name, value);
                }
              }
            }, {
              key: "formats",
              value: function formats() {
                return _defineProperty({}, this.statics.blotName, this.statics.formats(this.domNode));
              }
            }, {
              key: "insertBefore",
              value: function insertBefore(blot, ref) {
                if (blot instanceof ListItem) {
                  _get(List2.prototype.__proto__ || Object.getPrototypeOf(List2.prototype), "insertBefore", this).call(this, blot, ref);
                } else {
                  var index = ref == null ? this.length() : ref.offset(this);
                  var after = this.split(index);
                  after.parent.insertBefore(blot, after);
                }
              }
            }, {
              key: "optimize",
              value: function optimize(context) {
                _get(List2.prototype.__proto__ || Object.getPrototypeOf(List2.prototype), "optimize", this).call(this, context);
                var next = this.next;
                if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && next.domNode.tagName === this.domNode.tagName && next.domNode.getAttribute("data-checked") === this.domNode.getAttribute("data-checked")) {
                  next.moveChildren(this);
                  next.remove();
                }
              }
            }, {
              key: "replace",
              value: function replace(target) {
                if (target.statics.blotName !== this.statics.blotName) {
                  var item = _parchment2.default.create(this.statics.defaultChild);
                  target.moveChildren(item);
                  this.appendChild(item);
                }
                _get(List2.prototype.__proto__ || Object.getPrototypeOf(List2.prototype), "replace", this).call(this, target);
              }
            }]);
            return List2;
          }(_container2.default);
          List.blotName = "list";
          List.scope = _parchment2.default.Scope.BLOCK_BLOT;
          List.tagName = ["OL", "UL"];
          List.defaultChild = "list-item";
          List.allowedChildren = [ListItem];
          exports2.ListItem = ListItem;
          exports2.default = List;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _bold = __webpack_require__(56);
          var _bold2 = _interopRequireDefault(_bold);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var Italic = function(_Bold) {
            _inherits(Italic2, _Bold);
            function Italic2() {
              _classCallCheck(this, Italic2);
              return _possibleConstructorReturn(this, (Italic2.__proto__ || Object.getPrototypeOf(Italic2)).apply(this, arguments));
            }
            return Italic2;
          }(_bold2.default);
          Italic.blotName = "italic";
          Italic.tagName = ["EM", "I"];
          exports2.default = Italic;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _inline = __webpack_require__(6);
          var _inline2 = _interopRequireDefault(_inline);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var Script = function(_Inline) {
            _inherits(Script2, _Inline);
            function Script2() {
              _classCallCheck(this, Script2);
              return _possibleConstructorReturn(this, (Script2.__proto__ || Object.getPrototypeOf(Script2)).apply(this, arguments));
            }
            _createClass(Script2, null, [{
              key: "create",
              value: function create(value) {
                if (value === "super") {
                  return document.createElement("sup");
                } else if (value === "sub") {
                  return document.createElement("sub");
                } else {
                  return _get(Script2.__proto__ || Object.getPrototypeOf(Script2), "create", this).call(this, value);
                }
              }
            }, {
              key: "formats",
              value: function formats(domNode) {
                if (domNode.tagName === "SUB")
                  return "sub";
                if (domNode.tagName === "SUP")
                  return "super";
                return void 0;
              }
            }]);
            return Script2;
          }(_inline2.default);
          Script.blotName = "script";
          Script.tagName = ["SUB", "SUP"];
          exports2.default = Script;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _inline = __webpack_require__(6);
          var _inline2 = _interopRequireDefault(_inline);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var Strike = function(_Inline) {
            _inherits(Strike2, _Inline);
            function Strike2() {
              _classCallCheck(this, Strike2);
              return _possibleConstructorReturn(this, (Strike2.__proto__ || Object.getPrototypeOf(Strike2)).apply(this, arguments));
            }
            return Strike2;
          }(_inline2.default);
          Strike.blotName = "strike";
          Strike.tagName = "S";
          exports2.default = Strike;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _inline = __webpack_require__(6);
          var _inline2 = _interopRequireDefault(_inline);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var Underline = function(_Inline) {
            _inherits(Underline2, _Inline);
            function Underline2() {
              _classCallCheck(this, Underline2);
              return _possibleConstructorReturn(this, (Underline2.__proto__ || Object.getPrototypeOf(Underline2)).apply(this, arguments));
            }
            return Underline2;
          }(_inline2.default);
          Underline.blotName = "underline";
          Underline.tagName = "U";
          exports2.default = Underline;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _link = __webpack_require__(27);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var ATTRIBUTES = ["alt", "height", "width"];
          var Image = function(_Parchment$Embed) {
            _inherits(Image2, _Parchment$Embed);
            function Image2() {
              _classCallCheck(this, Image2);
              return _possibleConstructorReturn(this, (Image2.__proto__ || Object.getPrototypeOf(Image2)).apply(this, arguments));
            }
            _createClass(Image2, [{
              key: "format",
              value: function format(name, value) {
                if (ATTRIBUTES.indexOf(name) > -1) {
                  if (value) {
                    this.domNode.setAttribute(name, value);
                  } else {
                    this.domNode.removeAttribute(name);
                  }
                } else {
                  _get(Image2.prototype.__proto__ || Object.getPrototypeOf(Image2.prototype), "format", this).call(this, name, value);
                }
              }
            }], [{
              key: "create",
              value: function create(value) {
                var node = _get(Image2.__proto__ || Object.getPrototypeOf(Image2), "create", this).call(this, value);
                if (typeof value === "string") {
                  node.setAttribute("src", this.sanitize(value));
                }
                return node;
              }
            }, {
              key: "formats",
              value: function formats(domNode) {
                return ATTRIBUTES.reduce(function(formats2, attribute) {
                  if (domNode.hasAttribute(attribute)) {
                    formats2[attribute] = domNode.getAttribute(attribute);
                  }
                  return formats2;
                }, {});
              }
            }, {
              key: "match",
              value: function match(url) {
                return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
              }
            }, {
              key: "sanitize",
              value: function sanitize(url) {
                return (0, _link.sanitize)(url, ["http", "https", "data"]) ? url : "//:0";
              }
            }, {
              key: "value",
              value: function value(domNode) {
                return domNode.getAttribute("src");
              }
            }]);
            return Image2;
          }(_parchment2.default.Embed);
          Image.blotName = "image";
          Image.tagName = "IMG";
          exports2.default = Image;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _block = __webpack_require__(4);
          var _link = __webpack_require__(27);
          var _link2 = _interopRequireDefault(_link);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var ATTRIBUTES = ["height", "width"];
          var Video = function(_BlockEmbed) {
            _inherits(Video2, _BlockEmbed);
            function Video2() {
              _classCallCheck(this, Video2);
              return _possibleConstructorReturn(this, (Video2.__proto__ || Object.getPrototypeOf(Video2)).apply(this, arguments));
            }
            _createClass(Video2, [{
              key: "format",
              value: function format(name, value) {
                if (ATTRIBUTES.indexOf(name) > -1) {
                  if (value) {
                    this.domNode.setAttribute(name, value);
                  } else {
                    this.domNode.removeAttribute(name);
                  }
                } else {
                  _get(Video2.prototype.__proto__ || Object.getPrototypeOf(Video2.prototype), "format", this).call(this, name, value);
                }
              }
            }], [{
              key: "create",
              value: function create(value) {
                var node = _get(Video2.__proto__ || Object.getPrototypeOf(Video2), "create", this).call(this, value);
                node.setAttribute("frameborder", "0");
                node.setAttribute("allowfullscreen", true);
                node.setAttribute("src", this.sanitize(value));
                return node;
              }
            }, {
              key: "formats",
              value: function formats(domNode) {
                return ATTRIBUTES.reduce(function(formats2, attribute) {
                  if (domNode.hasAttribute(attribute)) {
                    formats2[attribute] = domNode.getAttribute(attribute);
                  }
                  return formats2;
                }, {});
              }
            }, {
              key: "sanitize",
              value: function sanitize(url) {
                return _link2.default.sanitize(url);
              }
            }, {
              key: "value",
              value: function value(domNode) {
                return domNode.getAttribute("src");
              }
            }]);
            return Video2;
          }(_block.BlockEmbed);
          Video.blotName = "video";
          Video.className = "ql-video";
          Video.tagName = "IFRAME";
          exports2.default = Video;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.default = exports2.FormulaBlot = void 0;
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _embed = __webpack_require__(35);
          var _embed2 = _interopRequireDefault(_embed);
          var _quill = __webpack_require__(5);
          var _quill2 = _interopRequireDefault(_quill);
          var _module = __webpack_require__(9);
          var _module2 = _interopRequireDefault(_module);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var FormulaBlot = function(_Embed) {
            _inherits(FormulaBlot2, _Embed);
            function FormulaBlot2() {
              _classCallCheck(this, FormulaBlot2);
              return _possibleConstructorReturn(this, (FormulaBlot2.__proto__ || Object.getPrototypeOf(FormulaBlot2)).apply(this, arguments));
            }
            _createClass(FormulaBlot2, null, [{
              key: "create",
              value: function create(value) {
                var node = _get(FormulaBlot2.__proto__ || Object.getPrototypeOf(FormulaBlot2), "create", this).call(this, value);
                if (typeof value === "string") {
                  window.katex.render(value, node, {
                    throwOnError: false,
                    errorColor: "#f00"
                  });
                  node.setAttribute("data-value", value);
                }
                return node;
              }
            }, {
              key: "value",
              value: function value(domNode) {
                return domNode.getAttribute("data-value");
              }
            }]);
            return FormulaBlot2;
          }(_embed2.default);
          FormulaBlot.blotName = "formula";
          FormulaBlot.className = "ql-formula";
          FormulaBlot.tagName = "SPAN";
          var Formula = function(_Module) {
            _inherits(Formula2, _Module);
            _createClass(Formula2, null, [{
              key: "register",
              value: function register() {
                _quill2.default.register(FormulaBlot, true);
              }
            }]);
            function Formula2() {
              _classCallCheck(this, Formula2);
              var _this2 = _possibleConstructorReturn(this, (Formula2.__proto__ || Object.getPrototypeOf(Formula2)).call(this));
              if (window.katex == null) {
                throw new Error("Formula module requires KaTeX.");
              }
              return _this2;
            }
            return Formula2;
          }(_module2.default);
          exports2.FormulaBlot = FormulaBlot;
          exports2.default = Formula;
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.default = exports2.CodeToken = exports2.CodeBlock = void 0;
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _parchment = __webpack_require__(0);
          var _parchment2 = _interopRequireDefault(_parchment);
          var _quill = __webpack_require__(5);
          var _quill2 = _interopRequireDefault(_quill);
          var _module = __webpack_require__(9);
          var _module2 = _interopRequireDefault(_module);
          var _code = __webpack_require__(13);
          var _code2 = _interopRequireDefault(_code);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var SyntaxCodeBlock = function(_CodeBlock) {
            _inherits(SyntaxCodeBlock2, _CodeBlock);
            function SyntaxCodeBlock2() {
              _classCallCheck(this, SyntaxCodeBlock2);
              return _possibleConstructorReturn(this, (SyntaxCodeBlock2.__proto__ || Object.getPrototypeOf(SyntaxCodeBlock2)).apply(this, arguments));
            }
            _createClass(SyntaxCodeBlock2, [{
              key: "replaceWith",
              value: function replaceWith(block) {
                this.domNode.textContent = this.domNode.textContent;
                this.attach();
                _get(SyntaxCodeBlock2.prototype.__proto__ || Object.getPrototypeOf(SyntaxCodeBlock2.prototype), "replaceWith", this).call(this, block);
              }
            }, {
              key: "highlight",
              value: function highlight(_highlight) {
                var text = this.domNode.textContent;
                if (this.cachedText !== text) {
                  if (text.trim().length > 0 || this.cachedText == null) {
                    this.domNode.innerHTML = _highlight(text);
                    this.domNode.normalize();
                    this.attach();
                  }
                  this.cachedText = text;
                }
              }
            }]);
            return SyntaxCodeBlock2;
          }(_code2.default);
          SyntaxCodeBlock.className = "ql-syntax";
          var CodeToken = new _parchment2.default.Attributor.Class("token", "hljs", {
            scope: _parchment2.default.Scope.INLINE
          });
          var Syntax = function(_Module) {
            _inherits(Syntax2, _Module);
            _createClass(Syntax2, null, [{
              key: "register",
              value: function register() {
                _quill2.default.register(CodeToken, true);
                _quill2.default.register(SyntaxCodeBlock, true);
              }
            }]);
            function Syntax2(quill, options) {
              _classCallCheck(this, Syntax2);
              var _this2 = _possibleConstructorReturn(this, (Syntax2.__proto__ || Object.getPrototypeOf(Syntax2)).call(this, quill, options));
              if (typeof _this2.options.highlight !== "function") {
                throw new Error("Syntax module requires highlight.js. Please include the library on the page before Quill.");
              }
              var timer = null;
              _this2.quill.on(_quill2.default.events.SCROLL_OPTIMIZE, function() {
                clearTimeout(timer);
                timer = setTimeout(function() {
                  _this2.highlight();
                  timer = null;
                }, _this2.options.interval);
              });
              _this2.highlight();
              return _this2;
            }
            _createClass(Syntax2, [{
              key: "highlight",
              value: function highlight() {
                var _this3 = this;
                if (this.quill.selection.composing)
                  return;
                this.quill.update(_quill2.default.sources.USER);
                var range = this.quill.getSelection();
                this.quill.scroll.descendants(SyntaxCodeBlock).forEach(function(code) {
                  code.highlight(_this3.options.highlight);
                });
                this.quill.update(_quill2.default.sources.SILENT);
                if (range != null) {
                  this.quill.setSelection(range, _quill2.default.sources.SILENT);
                }
              }
            }]);
            return Syntax2;
          }(_module2.default);
          Syntax.DEFAULTS = {
            highlight: function() {
              if (window.hljs == null)
                return null;
              return function(text) {
                var result = window.hljs.highlightAuto(text);
                return result.value;
              };
            }(),
            interval: 1e3
          };
          exports2.CodeBlock = SyntaxCodeBlock;
          exports2.CodeToken = CodeToken;
          exports2.default = Syntax;
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=3 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=13 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=9 y1=4 y2=4></line> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=14 x2=4 y1=14 y2=14></line> <line class=ql-stroke x1=12 x2=6 y1=4 y2=4></line> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=15 x2=5 y1=14 y2=14></line> <line class=ql-stroke x1=15 x2=9 y1=4 y2=4></line> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=15 x2=3 y1=14 y2=14></line> <line class=ql-stroke x1=15 x2=3 y1=4 y2=4></line> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <g class="ql-fill ql-color-label"> <polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868"></polygon> <rect height=1 width=1 x=4 y=4></rect> <polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5"></polygon> <rect height=1 width=1 x=2 y=6></rect> <rect height=1 width=1 x=3 y=5></rect> <rect height=1 width=1 x=4 y=7></rect> <polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439"></polygon> <rect height=1 width=1 x=2 y=12></rect> <rect height=1 width=1 x=2 y=9></rect> <rect height=1 width=1 x=2 y=15></rect> <polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10"></polygon> <rect height=1 width=1 x=3 y=8></rect> <path d=M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z></path> <path d=M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z></path> <path d=M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z></path> <rect height=1 width=1 x=12 y=2></rect> <rect height=1 width=1 x=11 y=3></rect> <path d=M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z></path> <rect height=1 width=1 x=2 y=3></rect> <rect height=1 width=1 x=6 y=2></rect> <rect height=1 width=1 x=3 y=2></rect> <rect height=1 width=1 x=5 y=3></rect> <rect height=1 width=1 x=9 y=2></rect> <rect height=1 width=1 x=15 y=14></rect> <polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174"></polygon> <rect height=1 width=1 x=13 y=7></rect> <rect height=1 width=1 x=15 y=5></rect> <rect height=1 width=1 x=14 y=6></rect> <rect height=1 width=1 x=15 y=8></rect> <rect height=1 width=1 x=14 y=9></rect> <path d=M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z></path> <rect height=1 width=1 x=14 y=3></rect> <polygon points="12 6.868 12 6 11.62 6 12 6.868"></polygon> <rect height=1 width=1 x=15 y=2></rect> <rect height=1 width=1 x=12 y=5></rect> <rect height=1 width=1 x=13 y=4></rect> <polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9"></polygon> <rect height=1 width=1 x=9 y=14></rect> <rect height=1 width=1 x=8 y=15></rect> <path d=M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z></path> <rect height=1 width=1 x=5 y=15></rect> <path d=M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z></path> <rect height=1 width=1 x=11 y=15></rect> <path d=M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z></path> <rect height=1 width=1 x=14 y=15></rect> <rect height=1 width=1 x=15 y=11></rect> </g> <polyline class=ql-stroke points="5.5 13 9 5 12.5 13"></polyline> <line class=ql-stroke x1=11.63 x2=6.38 y1=11 y2=11></line> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <rect class="ql-fill ql-stroke" height=3 width=3 x=4 y=5></rect> <rect class="ql-fill ql-stroke" height=3 width=3 x=11 y=5></rect> <path class="ql-even ql-fill ql-stroke" d=M7,8c0,4.031-3,5-3,5></path> <path class="ql-even ql-fill ql-stroke" d=M14,8c0,4.031-3,5-3,5></path> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-stroke d=M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z></path> <path class=ql-stroke d=M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z></path> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg class="" viewbox="0 0 18 18"> <line class=ql-stroke x1=5 x2=13 y1=3 y2=3></line> <line class=ql-stroke x1=6 x2=9.35 y1=12 y2=3></line> <line class=ql-stroke x1=11 x2=15 y1=11 y2=15></line> <line class=ql-stroke x1=15 x2=11 y1=11 y2=15></line> <rect class=ql-fill height=1 rx=0.5 ry=0.5 width=7 x=2 y=14></rect> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <line class="ql-color-label ql-stroke ql-transparent" x1=3 x2=15 y1=15 y2=15></line> <polyline class=ql-stroke points="5.5 11 9 3 12.5 11"></polyline> <line class=ql-stroke x1=11.63 x2=6.38 y1=9 y2=9></line> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <polygon class="ql-stroke ql-fill" points="3 11 5 9 3 7 3 11"></polygon> <line class="ql-stroke ql-fill" x1=15 x2=11 y1=4 y2=4></line> <path class=ql-fill d=M11,3a3,3,0,0,0,0,6h1V3H11Z></path> <rect class=ql-fill height=11 width=1 x=11 y=4></rect> <rect class=ql-fill height=11 width=1 x=13 y=4></rect> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <polygon class="ql-stroke ql-fill" points="15 12 13 10 15 8 15 12"></polygon> <line class="ql-stroke ql-fill" x1=9 x2=5 y1=4 y2=4></line> <path class=ql-fill d=M5,3A3,3,0,0,0,5,9H6V3H5Z></path> <rect class=ql-fill height=11 width=1 x=5 y=4></rect> <rect class=ql-fill height=11 width=1 x=7 y=4></rect> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-fill d=M14,16H4a1,1,0,0,1,0-2H14A1,1,0,0,1,14,16Z /> <path class=ql-fill d=M14,4H4A1,1,0,0,1,4,2H14A1,1,0,0,1,14,4Z /> <rect class=ql-fill x=3 y=6 width=12 height=6 rx=1 ry=1 /> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-fill d=M13,16H5a1,1,0,0,1,0-2h8A1,1,0,0,1,13,16Z /> <path class=ql-fill d=M13,4H5A1,1,0,0,1,5,2h8A1,1,0,0,1,13,4Z /> <rect class=ql-fill x=2 y=6 width=14 height=6 rx=1 ry=1 /> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-fill d=M15,8H13a1,1,0,0,1,0-2h2A1,1,0,0,1,15,8Z /> <path class=ql-fill d=M15,12H13a1,1,0,0,1,0-2h2A1,1,0,0,1,15,12Z /> <path class=ql-fill d=M15,16H5a1,1,0,0,1,0-2H15A1,1,0,0,1,15,16Z /> <path class=ql-fill d=M15,4H5A1,1,0,0,1,5,2H15A1,1,0,0,1,15,4Z /> <rect class=ql-fill x=2 y=6 width=8 height=6 rx=1 ry=1 /> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-fill d=M5,8H3A1,1,0,0,1,3,6H5A1,1,0,0,1,5,8Z /> <path class=ql-fill d=M5,12H3a1,1,0,0,1,0-2H5A1,1,0,0,1,5,12Z /> <path class=ql-fill d=M13,16H3a1,1,0,0,1,0-2H13A1,1,0,0,1,13,16Z /> <path class=ql-fill d=M13,4H3A1,1,0,0,1,3,2H13A1,1,0,0,1,13,4Z /> <rect class=ql-fill x=8 y=6 width=8 height=6 rx=1 ry=1 transform="translate(24 18) rotate(-180)"/> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-fill d=M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z></path> <rect class=ql-fill height=1.6 rx=0.8 ry=0.8 width=5 x=5.15 y=6.2></rect> <path class=ql-fill d=M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z></path> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewBox="0 0 18 18"> <path class=ql-fill d=M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z /> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewBox="0 0 18 18"> <path class=ql-fill d=M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z /> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=7 x2=13 y1=4 y2=4></line> <line class=ql-stroke x1=5 x2=11 y1=14 y2=14></line> <line class=ql-stroke x1=8 x2=10 y1=14 y2=4></line> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <rect class=ql-stroke height=10 width=12 x=3 y=4></rect> <circle class=ql-fill cx=6 cy=7 r=1></circle> <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class="ql-fill ql-stroke" points="3 7 3 11 5 9 3 7"></polyline> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=ql-stroke points="5 7 5 11 3 9 5 7"></polyline> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=7 x2=11 y1=7 y2=11></line> <path class="ql-even ql-stroke" d=M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z></path> <path class="ql-even ql-stroke" d=M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z></path> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=7 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=7 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=7 x2=15 y1=14 y2=14></line> <line class="ql-stroke ql-thin" x1=2.5 x2=4.5 y1=5.5 y2=5.5></line> <path class=ql-fill d=M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z></path> <path class="ql-stroke ql-thin" d=M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156></path> <path class="ql-stroke ql-thin" d=M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109></path> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=6 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=6 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=6 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=3 y1=4 y2=4></line> <line class=ql-stroke x1=3 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=3 y1=14 y2=14></line> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg class="" viewbox="0 0 18 18"> <line class=ql-stroke x1=9 x2=15 y1=4 y2=4></line> <polyline class=ql-stroke points="3 4 4 5 6 3"></polyline> <line class=ql-stroke x1=9 x2=15 y1=14 y2=14></line> <polyline class=ql-stroke points="3 14 4 15 6 13"></polyline> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=ql-stroke points="3 9 4 10 6 8"></polyline> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-fill d=M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z /> <path class=ql-fill d=M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z /> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-fill d=M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z /> <path class=ql-fill d=M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z /> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <line class="ql-stroke ql-thin" x1=15.5 x2=2.5 y1=8.5 y2=9.5></line> <path class=ql-fill d=M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z></path> <path class=ql-fill d=M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z></path> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <path class=ql-stroke d=M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3></path> <rect class=ql-fill height=1 rx=0.5 ry=0.5 width=12 x=3 y=15></rect> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <rect class=ql-stroke height=12 width=12 x=3 y=3></rect> <rect class=ql-fill height=12 width=1 x=5 y=3></rect> <rect class=ql-fill height=12 width=1 x=12 y=3></rect> <rect class=ql-fill height=2 width=8 x=5 y=8></rect> <rect class=ql-fill height=1 width=3 x=3 y=5></rect> <rect class=ql-fill height=1 width=3 x=3 y=7></rect> <rect class=ql-fill height=1 width=3 x=3 y=10></rect> <rect class=ql-fill height=1 width=3 x=3 y=12></rect> <rect class=ql-fill height=1 width=3 x=12 y=5></rect> <rect class=ql-fill height=1 width=3 x=12 y=7></rect> <rect class=ql-fill height=1 width=3 x=12 y=10></rect> <rect class=ql-fill height=1 width=3 x=12 y=12></rect> </svg>';
        },
        function(module2, exports2) {
          module2.exports = '<svg viewbox="0 0 18 18"> <polygon class=ql-stroke points="7 11 9 13 11 11 7 11"></polygon> <polygon class=ql-stroke points="7 7 9 5 11 7 7 7"></polygon> </svg>';
        },
        function(module2, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.default = exports2.BubbleTooltip = void 0;
          var _get = function get(object, property, receiver) {
            if (object === null)
              object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === void 0) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return void 0;
              } else {
                return get(parent, property, receiver);
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === void 0) {
                return void 0;
              }
              return getter.call(receiver);
            }
          };
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _extend = __webpack_require__(3);
          var _extend2 = _interopRequireDefault(_extend);
          var _emitter = __webpack_require__(8);
          var _emitter2 = _interopRequireDefault(_emitter);
          var _base = __webpack_require__(43);
          var _base2 = _interopRequireDefault(_base);
          var _selection = __webpack_require__(15);
          var _icons = __webpack_require__(41);
          var _icons2 = _interopRequireDefault(_icons);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _possibleConstructorReturn(self2, call) {
            if (!self2) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self2;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
            if (superClass)
              Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
          }
          var TOOLBAR_CONFIG = [["bold", "italic", "link"], [{ header: 1 }, { header: 2 }, "blockquote"]];
          var BubbleTheme = function(_BaseTheme) {
            _inherits(BubbleTheme2, _BaseTheme);
            function BubbleTheme2(quill, options) {
              _classCallCheck(this, BubbleTheme2);
              if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
                options.modules.toolbar.container = TOOLBAR_CONFIG;
              }
              var _this = _possibleConstructorReturn(this, (BubbleTheme2.__proto__ || Object.getPrototypeOf(BubbleTheme2)).call(this, quill, options));
              _this.quill.container.classList.add("ql-bubble");
              return _this;
            }
            _createClass(BubbleTheme2, [{
              key: "extendToolbar",
              value: function extendToolbar(toolbar) {
                this.tooltip = new BubbleTooltip(this.quill, this.options.bounds);
                this.tooltip.root.appendChild(toolbar.container);
                this.buildButtons([].slice.call(toolbar.container.querySelectorAll("button")), _icons2.default);
                this.buildPickers([].slice.call(toolbar.container.querySelectorAll("select")), _icons2.default);
              }
            }]);
            return BubbleTheme2;
          }(_base2.default);
          BubbleTheme.DEFAULTS = (0, _extend2.default)(true, {}, _base2.default.DEFAULTS, {
            modules: {
              toolbar: {
                handlers: {
                  link: function link(value) {
                    if (!value) {
                      this.quill.format("link", false);
                    } else {
                      this.quill.theme.tooltip.edit();
                    }
                  }
                }
              }
            }
          });
          var BubbleTooltip = function(_BaseTooltip) {
            _inherits(BubbleTooltip2, _BaseTooltip);
            function BubbleTooltip2(quill, bounds) {
              _classCallCheck(this, BubbleTooltip2);
              var _this2 = _possibleConstructorReturn(this, (BubbleTooltip2.__proto__ || Object.getPrototypeOf(BubbleTooltip2)).call(this, quill, bounds));
              _this2.quill.on(_emitter2.default.events.EDITOR_CHANGE, function(type, range, oldRange, source) {
                if (type !== _emitter2.default.events.SELECTION_CHANGE)
                  return;
                if (range != null && range.length > 0 && source === _emitter2.default.sources.USER) {
                  _this2.show();
                  _this2.root.style.left = "0px";
                  _this2.root.style.width = "";
                  _this2.root.style.width = _this2.root.offsetWidth + "px";
                  var lines = _this2.quill.getLines(range.index, range.length);
                  if (lines.length === 1) {
                    _this2.position(_this2.quill.getBounds(range));
                  } else {
                    var lastLine = lines[lines.length - 1];
                    var index = _this2.quill.getIndex(lastLine);
                    var length = Math.min(lastLine.length() - 1, range.index + range.length - index);
                    var _bounds = _this2.quill.getBounds(new _selection.Range(index, length));
                    _this2.position(_bounds);
                  }
                } else if (document.activeElement !== _this2.textbox && _this2.quill.hasFocus()) {
                  _this2.hide();
                }
              });
              return _this2;
            }
            _createClass(BubbleTooltip2, [{
              key: "listen",
              value: function listen() {
                var _this3 = this;
                _get(BubbleTooltip2.prototype.__proto__ || Object.getPrototypeOf(BubbleTooltip2.prototype), "listen", this).call(this);
                this.root.querySelector(".ql-close").addEventListener("click", function() {
                  _this3.root.classList.remove("ql-editing");
                });
                this.quill.on(_emitter2.default.events.SCROLL_OPTIMIZE, function() {
                  setTimeout(function() {
                    if (_this3.root.classList.contains("ql-hidden"))
                      return;
                    var range = _this3.quill.getSelection();
                    if (range != null) {
                      _this3.position(_this3.quill.getBounds(range));
                    }
                  }, 1);
                });
              }
            }, {
              key: "cancel",
              value: function cancel() {
                this.show();
              }
            }, {
              key: "position",
              value: function position(reference) {
                var shift = _get(BubbleTooltip2.prototype.__proto__ || Object.getPrototypeOf(BubbleTooltip2.prototype), "position", this).call(this, reference);
                var arrow = this.root.querySelector(".ql-tooltip-arrow");
                arrow.style.marginLeft = "";
                if (shift === 0)
                  return shift;
                arrow.style.marginLeft = -1 * shift - arrow.offsetWidth / 2 + "px";
              }
            }]);
            return BubbleTooltip2;
          }(_base.BaseTooltip);
          BubbleTooltip.TEMPLATE = ['<span class="ql-tooltip-arrow"></span>', '<div class="ql-tooltip-editor">', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-close"></a>', "</div>"].join("");
          exports2.BubbleTooltip = BubbleTooltip;
          exports2.default = BubbleTheme;
        },
        function(module2, exports2, __webpack_require__) {
          module2.exports = __webpack_require__(63);
        }
      ])["default"];
    });
  }
});

// dep:quill
var quill_default = require_quill();
export {
  quill_default as default
};
/*!
 * Quill Editor v1.3.7
 * https://quilljs.com/
 * Copyright (c) 2014, Jason Chen
 * Copyright (c) 2013, salesforce.com
 */
//# sourceMappingURL=quill.js.map
