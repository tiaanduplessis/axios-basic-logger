!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?module.exports=o(require("pico-uid")):"function"==typeof define&&define.amd?define(["pico-uid"],o):e.axiosBasicLogger=o(e.uid)}(this,function(e){function o(e,o){return void 0===e&&(e="0"),void 0===o&&(o=2),e.toString().padStart(o,"0")}function t(e){return o(e.getHours())+":"+o(e.getMinutes())+":"+o(e.getSeconds())+":"+e.getMilliseconds()}function n(e,o){var t=e.url;return"REQUEST  "+o+" "+e.method.toUpperCase()+" "+t}function r(e,o,t){var n=e.config;return"RESPONSE "+o+" "+e.status+" ("+n.method.toUpperCase()+" "+n.url+") "+t+"ms"}return e=e&&e.hasOwnProperty("default")?e.default:e,function(o,i){void 0===i&&(i={});var u=i.requestLogger;void 0===u&&(u=n);var s=i.responseLogger;void 0===s&&(s=r);var d={};o.interceptors.request.use(function(o){var n=new Date,r=u(o,t(n)),i=e(30);return o.logId=i,d[i]=n,console.log(r),o}),o.interceptors.response.use(function(e){var o=new Date,n=d[e.config.logId];delete d[e.config.logId];var i=r(e,t(o),o.getTime()-n.getTime());return console.log(i),e})}});
//# sourceMappingURL=axios-basic-logger.umd.js.map
