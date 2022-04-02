// @ts-nocheck
const xhr = new window._XMLHttpRequest();
window.XMLHttpRequest.prototype.upload = xhr.upload;
