// @ts-nocheck

import "./chat";

const xhr = new window._XMLHttpRequest();
window.XMLHttpRequest.prototype.upload = xhr.upload;
