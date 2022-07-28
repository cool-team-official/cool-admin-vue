import "./chunk-QOVRSCHT.js";

// node_modules/vite/dist/client/env.mjs
var context = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  } else if (typeof self !== "undefined") {
    return self;
  } else if (typeof window !== "undefined") {
    return window;
  } else {
    return Function("return this")();
  }
})();
var defines = __DEFINES__;
Object.keys(defines).forEach((key) => {
  const segments = key.split(".");
  let target = context;
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (i === segments.length - 1) {
      target[segment] = defines[key];
    } else {
      target = target[segment] || (target[segment] = {});
    }
  }
});

// node_modules/vite/dist/client/client.mjs
var template = `
<style>
:host {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin: 0;
  background: rgba(0, 0, 0, 0.66);
  --monospace: 'SFMono-Regular', Consolas,
              'Liberation Mono', Menlo, Courier, monospace;
  --red: #ff5555;
  --yellow: #e2aa53;
  --purple: #cfa4ff;
  --cyan: #2dd9da;
  --dim: #c9c9c9;
}

.window {
  font-family: var(--monospace);
  line-height: 1.5;
  width: 800px;
  color: #d8d8d8;
  margin: 30px auto;
  padding: 25px 40px;
  position: relative;
  background: #181818;
  border-radius: 6px 6px 8px 8px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  overflow: hidden;
  border-top: 8px solid var(--red);
  direction: ltr;
  text-align: left;
}

pre {
  font-family: var(--monospace);
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 1em;
  overflow-x: scroll;
  scrollbar-width: none;
}

pre::-webkit-scrollbar {
  display: none;
}

.message {
  line-height: 1.3;
  font-weight: 600;
  white-space: pre-wrap;
}

.message-body {
  color: var(--red);
}

.plugin {
  color: var(--purple);
}

.file {
  color: var(--cyan);
  margin-bottom: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.frame {
  color: var(--yellow);
}

.stack {
  font-size: 13px;
  color: var(--dim);
}

.tip {
  font-size: 13px;
  color: #999;
  border-top: 1px dotted #999;
  padding-top: 13px;
}

code {
  font-size: 13px;
  font-family: var(--monospace);
  color: var(--yellow);
}

.file-link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
<div class="window">
  <pre class="message"><span class="plugin"></span><span class="message-body"></span></pre>
  <pre class="file"></pre>
  <pre class="frame"></pre>
  <pre class="stack"></pre>
  <div class="tip">
    Click outside or fix the code to dismiss.<br>
    You can also disable this overlay by setting
    <code>server.hmr.overlay</code> to <code>false</code> in <code>vite.config.js.</code>
  </div>
</div>
`;
var fileRE = /(?:[a-zA-Z]:\\|\/).*?:\d+:\d+/g;
var codeframeRE = /^(?:>?\s+\d+\s+\|.*|\s+\|\s*\^.*)\r?\n/gm;
var { HTMLElement = class {
} } = globalThis;
var ErrorOverlay = class extends HTMLElement {
  constructor(err) {
    var _a;
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.root.innerHTML = template;
    codeframeRE.lastIndex = 0;
    const hasFrame = err.frame && codeframeRE.test(err.frame);
    const message = hasFrame ? err.message.replace(codeframeRE, "") : err.message;
    if (err.plugin) {
      this.text(".plugin", `[plugin:${err.plugin}] `);
    }
    this.text(".message-body", message.trim());
    const [file] = (((_a = err.loc) === null || _a === void 0 ? void 0 : _a.file) || err.id || "unknown file").split(`?`);
    if (err.loc) {
      this.text(".file", `${file}:${err.loc.line}:${err.loc.column}`, true);
    } else if (err.id) {
      this.text(".file", file);
    }
    if (hasFrame) {
      this.text(".frame", err.frame.trim());
    }
    this.text(".stack", err.stack, true);
    this.root.querySelector(".window").addEventListener("click", (e) => {
      e.stopPropagation();
    });
    this.addEventListener("click", () => {
      this.close();
    });
  }
  text(selector, text, linkFiles = false) {
    const el = this.root.querySelector(selector);
    if (!linkFiles) {
      el.textContent = text;
    } else {
      let curIndex = 0;
      let match;
      while (match = fileRE.exec(text)) {
        const { 0: file, index } = match;
        if (index != null) {
          const frag = text.slice(curIndex, index);
          el.appendChild(document.createTextNode(frag));
          const link = document.createElement("a");
          link.textContent = file;
          link.className = "file-link";
          link.onclick = () => {
            fetch("/__open-in-editor?file=" + encodeURIComponent(file));
          };
          el.appendChild(link);
          curIndex += frag.length + file.length;
        }
      }
    }
  }
  close() {
    var _a;
    (_a = this.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this);
  }
};
var overlayId = "vite-error-overlay";
var { customElements } = globalThis;
if (customElements && !customElements.get(overlayId)) {
  customElements.define(overlayId, ErrorOverlay);
}
console.debug("[vite] connecting...");
var importMetaUrl = new URL(import.meta.url);
var serverHost = __SERVER_HOST__;
var socketProtocol = __HMR_PROTOCOL__ || (location.protocol === "https:" ? "wss" : "ws");
var hmrPort = __HMR_PORT__;
var socketHost = `${__HMR_HOSTNAME__ || importMetaUrl.hostname}:${hmrPort || importMetaUrl.port}${__HMR_BASE__}`;
var directSocketHost = __HMR_DIRECT_TARGET__;
var base = __BASE__ || "/";
var messageBuffer = [];
var socket;
try {
  let fallback;
  if (!hmrPort) {
    fallback = () => {
      socket = setupWebSocket(socketProtocol, directSocketHost, () => {
        const currentScriptHostURL = new URL(import.meta.url);
        const currentScriptHost = currentScriptHostURL.host + currentScriptHostURL.pathname.replace(/@vite\/client$/, "");
        console.error(`[vite] failed to connect to websocket.
your current setup:
  (browser) ${currentScriptHost} <--[HTTP]--> ${serverHost} (server)
  (browser) ${socketHost} <--[WebSocket (failing)]--> ${directSocketHost} (server)
Check out your Vite / network configuration and https://vitejs.dev/config/server-options.html#server-hmr .`);
      });
      socket.addEventListener("open", () => {
        console.info("[vite] Direct websocket connection fallback. Check out https://vitejs.dev/config/server-options.html#server-hmr to remove the previous connection error.");
      }, { once: true });
    };
  }
  socket = setupWebSocket(socketProtocol, socketHost, fallback);
} catch (error) {
  console.error(`[vite] failed to connect to websocket (${error}). `);
}
function setupWebSocket(protocol, hostAndPath, onCloseWithoutOpen) {
  const socket2 = new WebSocket(`${protocol}://${hostAndPath}`, "vite-hmr");
  let isOpened = false;
  socket2.addEventListener("open", () => {
    isOpened = true;
  }, { once: true });
  socket2.addEventListener("message", async ({ data }) => {
    handleMessage(JSON.parse(data));
  });
  socket2.addEventListener("close", async ({ wasClean }) => {
    if (wasClean)
      return;
    if (!isOpened && onCloseWithoutOpen) {
      onCloseWithoutOpen();
      return;
    }
    console.log(`[vite] server connection lost. polling for restart...`);
    await waitForSuccessfulPing(hostAndPath);
    location.reload();
  });
  return socket2;
}
function warnFailedFetch(err, path) {
  if (!err.message.match("fetch")) {
    console.error(err);
  }
  console.error(`[hmr] Failed to reload ${path}. This could be due to syntax errors or importing non-existent modules. (see errors above)`);
}
function cleanUrl(pathname) {
  const url = new URL(pathname, location.toString());
  url.searchParams.delete("direct");
  return url.pathname + url.search;
}
var isFirstUpdate = true;
async function handleMessage(payload) {
  switch (payload.type) {
    case "connected":
      console.debug(`[vite] connected.`);
      sendMessageBuffer();
      setInterval(() => {
        if (socket.readyState === socket.OPEN) {
          socket.send('{"type":"ping"}');
        }
      }, __HMR_TIMEOUT__);
      break;
    case "update":
      notifyListeners("vite:beforeUpdate", payload);
      if (isFirstUpdate && hasErrorOverlay()) {
        window.location.reload();
        return;
      } else {
        clearErrorOverlay();
        isFirstUpdate = false;
      }
      payload.updates.forEach((update) => {
        if (update.type === "js-update") {
          queueUpdate(fetchUpdate(update));
        } else {
          const { path, timestamp } = update;
          const searchUrl = cleanUrl(path);
          const el = Array.from(document.querySelectorAll("link")).find((e) => cleanUrl(e.href).includes(searchUrl));
          if (el) {
            const newPath = `${base}${searchUrl.slice(1)}${searchUrl.includes("?") ? "&" : "?"}t=${timestamp}`;
            const newLinkTag = el.cloneNode();
            newLinkTag.href = new URL(newPath, el.href).href;
            const removeOldEl = () => el.remove();
            newLinkTag.addEventListener("load", removeOldEl);
            newLinkTag.addEventListener("error", removeOldEl);
            el.after(newLinkTag);
          }
          console.log(`[vite] css hot updated: ${searchUrl}`);
        }
      });
      break;
    case "custom": {
      notifyListeners(payload.event, payload.data);
      break;
    }
    case "full-reload":
      notifyListeners("vite:beforeFullReload", payload);
      if (payload.path && payload.path.endsWith(".html")) {
        const pagePath = decodeURI(location.pathname);
        const payloadPath = base + payload.path.slice(1);
        if (pagePath === payloadPath || payload.path === "/index.html" || pagePath.endsWith("/") && pagePath + "index.html" === payloadPath) {
          location.reload();
        }
        return;
      } else {
        location.reload();
      }
      break;
    case "prune":
      notifyListeners("vite:beforePrune", payload);
      payload.paths.forEach((path) => {
        const fn = pruneMap.get(path);
        if (fn) {
          fn(dataMap.get(path));
        }
      });
      break;
    case "error": {
      notifyListeners("vite:error", payload);
      const err = payload.err;
      if (enableOverlay) {
        createErrorOverlay(err);
      } else {
        console.error(`[vite] Internal Server Error
${err.message}
${err.stack}`);
      }
      break;
    }
    default: {
      const check = payload;
      return check;
    }
  }
}
function notifyListeners(event, data) {
  const cbs = customListenersMap.get(event);
  if (cbs) {
    cbs.forEach((cb) => cb(data));
  }
}
var enableOverlay = __HMR_ENABLE_OVERLAY__;
function createErrorOverlay(err) {
  if (!enableOverlay)
    return;
  clearErrorOverlay();
  document.body.appendChild(new ErrorOverlay(err));
}
function clearErrorOverlay() {
  document.querySelectorAll(overlayId).forEach((n) => n.close());
}
function hasErrorOverlay() {
  return document.querySelectorAll(overlayId).length;
}
var pending = false;
var queued = [];
async function queueUpdate(p) {
  queued.push(p);
  if (!pending) {
    pending = true;
    await Promise.resolve();
    pending = false;
    const loading = [...queued];
    queued = [];
    (await Promise.all(loading)).forEach((fn) => fn && fn());
  }
}
async function waitForSuccessfulPing(hostAndPath, ms = 1e3) {
  while (true) {
    try {
      await fetch(`${location.protocol}//${hostAndPath}`, { mode: "no-cors" });
      break;
    } catch (e) {
      await new Promise((resolve) => setTimeout(resolve, ms));
    }
  }
}
var sheetsMap = /* @__PURE__ */ new Map();
function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  {
    if (style && !(style instanceof HTMLStyleElement)) {
      removeStyle(id);
      style = void 0;
    }
    if (!style) {
      style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.innerHTML = content;
      document.head.appendChild(style);
    } else {
      style.innerHTML = content;
    }
  }
  sheetsMap.set(id, style);
}
function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style) {
    if (style instanceof CSSStyleSheet) {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s) => s !== style);
    } else {
      document.head.removeChild(style);
    }
    sheetsMap.delete(id);
  }
}
async function fetchUpdate({ path, acceptedPath, timestamp }) {
  const mod = hotModulesMap.get(path);
  if (!mod) {
    return;
  }
  const moduleMap = /* @__PURE__ */ new Map();
  const isSelfUpdate = path === acceptedPath;
  const modulesToUpdate = /* @__PURE__ */ new Set();
  if (isSelfUpdate) {
    modulesToUpdate.add(path);
  } else {
    for (const { deps } of mod.callbacks) {
      deps.forEach((dep) => {
        if (acceptedPath === dep) {
          modulesToUpdate.add(dep);
        }
      });
    }
  }
  const qualifiedCallbacks = mod.callbacks.filter(({ deps }) => {
    return deps.some((dep) => modulesToUpdate.has(dep));
  });
  await Promise.all(Array.from(modulesToUpdate).map(async (dep) => {
    const disposer = disposeMap.get(dep);
    if (disposer)
      await disposer(dataMap.get(dep));
    const [path2, query] = dep.split(`?`);
    try {
      const newMod = await import(
        /* @vite-ignore */
        base + path2.slice(1) + `?import&t=${timestamp}${query ? `&${query}` : ""}`
      );
      moduleMap.set(dep, newMod);
    } catch (e) {
      warnFailedFetch(e, dep);
    }
  }));
  return () => {
    for (const { deps, fn } of qualifiedCallbacks) {
      fn(deps.map((dep) => moduleMap.get(dep)));
    }
    const loggedPath = isSelfUpdate ? path : `${acceptedPath} via ${path}`;
    console.log(`[vite] hot updated: ${loggedPath}`);
  };
}
function sendMessageBuffer() {
  if (socket.readyState === 1) {
    messageBuffer.forEach((msg) => socket.send(msg));
    messageBuffer.length = 0;
  }
}
var hotModulesMap = /* @__PURE__ */ new Map();
var disposeMap = /* @__PURE__ */ new Map();
var pruneMap = /* @__PURE__ */ new Map();
var dataMap = /* @__PURE__ */ new Map();
var customListenersMap = /* @__PURE__ */ new Map();
var ctxToListenersMap = /* @__PURE__ */ new Map();
function createHotContext(ownerPath) {
  if (!dataMap.has(ownerPath)) {
    dataMap.set(ownerPath, {});
  }
  const mod = hotModulesMap.get(ownerPath);
  if (mod) {
    mod.callbacks = [];
  }
  const staleListeners = ctxToListenersMap.get(ownerPath);
  if (staleListeners) {
    for (const [event, staleFns] of staleListeners) {
      const listeners = customListenersMap.get(event);
      if (listeners) {
        customListenersMap.set(event, listeners.filter((l) => !staleFns.includes(l)));
      }
    }
  }
  const newListeners = /* @__PURE__ */ new Map();
  ctxToListenersMap.set(ownerPath, newListeners);
  function acceptDeps(deps, callback = () => {
  }) {
    const mod2 = hotModulesMap.get(ownerPath) || {
      id: ownerPath,
      callbacks: []
    };
    mod2.callbacks.push({
      deps,
      fn: callback
    });
    hotModulesMap.set(ownerPath, mod2);
  }
  const hot = {
    get data() {
      return dataMap.get(ownerPath);
    },
    accept(deps, callback) {
      if (typeof deps === "function" || !deps) {
        acceptDeps([ownerPath], ([mod2]) => deps && deps(mod2));
      } else if (typeof deps === "string") {
        acceptDeps([deps], ([mod2]) => callback && callback(mod2));
      } else if (Array.isArray(deps)) {
        acceptDeps(deps, callback);
      } else {
        throw new Error(`invalid hot.accept() usage.`);
      }
    },
    acceptExports(_, callback) {
      acceptDeps([ownerPath], callback && (([mod2]) => callback(mod2)));
    },
    dispose(cb) {
      disposeMap.set(ownerPath, cb);
    },
    prune(cb) {
      pruneMap.set(ownerPath, cb);
    },
    decline() {
    },
    invalidate() {
      location.reload();
    },
    on(event, cb) {
      const addToMap = (map) => {
        const existing = map.get(event) || [];
        existing.push(cb);
        map.set(event, existing);
      };
      addToMap(customListenersMap);
      addToMap(newListeners);
    },
    send(event, data) {
      messageBuffer.push(JSON.stringify({ type: "custom", event, data }));
      sendMessageBuffer();
    }
  };
  return hot;
}
function injectQuery(url, queryToInject) {
  if (!url.startsWith(".") && !url.startsWith("/")) {
    return url;
  }
  const pathname = url.replace(/#.*$/, "").replace(/\?.*$/, "");
  const { search, hash } = new URL(url, "http://vitejs.dev");
  return `${pathname}?${queryToInject}${search ? `&` + search.slice(1) : ""}${hash || ""}`;
}
export {
  ErrorOverlay,
  createHotContext,
  injectQuery,
  removeStyle,
  updateStyle
};
//# sourceMappingURL=vite_dist_client_client__mjs.js.map
