import {g as getDefaultExportFromCjs, c as createCommonjsModule, a as commonjsGlobal} from "./common/_commonjsHelpers-37fa8da4.js";
import {c as common, s as serializers, t as transferable} from "./common/messages-ff4dc575.js";
import {m as master} from "./common/index-8c43a46e.js";
import {w as worker} from "./common/index-8f931ff4.js";
import "./imports/optimized/debug.js";
import "./imports/optimized/observable-fns.js";
import "./common/_observable-fns_commonjs-external-90672bf0.js";
import "./imports/optimized/is-observable.js";
var dist = createCommonjsModule(function(module, exports) {
  var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    Object.defineProperty(o, k2, {enumerable: true, get: function() {
      return m[k];
    }});
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Transfer = exports.DefaultSerializer = exports.expose = exports.registerSerializer = void 0;
  Object.defineProperty(exports, "registerSerializer", {enumerable: true, get: function() {
    return common.registerSerializer;
  }});
  __exportStar(master, exports);
  Object.defineProperty(exports, "expose", {enumerable: true, get: function() {
    return worker.expose;
  }});
  Object.defineProperty(exports, "DefaultSerializer", {enumerable: true, get: function() {
    return serializers.DefaultSerializer;
  }});
  Object.defineProperty(exports, "Transfer", {enumerable: true, get: function() {
    return transferable.Transfer;
  }});
});
var Threads = /* @__PURE__ */ getDefaultExportFromCjs(dist);
const registerSerializer = Threads.registerSerializer;
const spawn = Threads.spawn;
const BlobWorker = Threads.BlobWorker;
const DefaultSerializer = Threads.DefaultSerializer;
const Pool = Threads.Pool;
const Thread = Threads.Thread;
const Transfer = Threads.Transfer;
const Worker = Threads.Worker;
export {BlobWorker, DefaultSerializer, Pool, Thread, Transfer, Worker, registerSerializer, spawn};
export default null;
