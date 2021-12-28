import {c as createCommonjsModule} from "./_commonjsHelpers-37fa8da4.js";
var serializers = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.DefaultSerializer = exports.extendSerializer = void 0;
  function extendSerializer(extend, implementation) {
    const fallbackDeserializer = extend.deserialize.bind(extend);
    const fallbackSerializer = extend.serialize.bind(extend);
    return {
      deserialize(message) {
        return implementation.deserialize(message, fallbackDeserializer);
      },
      serialize(input) {
        return implementation.serialize(input, fallbackSerializer);
      }
    };
  }
  exports.extendSerializer = extendSerializer;
  const DefaultErrorSerializer = {
    deserialize(message) {
      return Object.assign(Error(message.message), {
        name: message.name,
        stack: message.stack
      });
    },
    serialize(error) {
      return {
        __error_marker: "$$error",
        message: error.message,
        name: error.name,
        stack: error.stack
      };
    }
  };
  const isSerializedError = (thing) => thing && typeof thing === "object" && "__error_marker" in thing && thing.__error_marker === "$$error";
  exports.DefaultSerializer = {
    deserialize(message) {
      if (isSerializedError(message)) {
        return DefaultErrorSerializer.deserialize(message);
      } else {
        return message;
      }
    },
    serialize(input) {
      if (input instanceof Error) {
        return DefaultErrorSerializer.serialize(input);
      } else {
        return input;
      }
    }
  };
});
var common = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.serialize = exports.deserialize = exports.registerSerializer = void 0;
  let registeredSerializer = serializers.DefaultSerializer;
  function registerSerializer(serializer) {
    registeredSerializer = serializers.extendSerializer(registeredSerializer, serializer);
  }
  exports.registerSerializer = registerSerializer;
  function deserialize(message) {
    return registeredSerializer.deserialize(message);
  }
  exports.deserialize = deserialize;
  function serialize(input) {
    return registeredSerializer.serialize(input);
  }
  exports.serialize = serialize;
});
var symbols = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.$worker = exports.$transferable = exports.$terminate = exports.$events = exports.$errors = void 0;
  exports.$errors = Symbol("thread.errors");
  exports.$events = Symbol("thread.events");
  exports.$terminate = Symbol("thread.terminate");
  exports.$transferable = Symbol("thread.transferable");
  exports.$worker = Symbol("thread.worker");
});
function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
var globalContext;
if (typeof window !== "undefined") {
  globalContext = window;
} else if (typeof self !== "undefined") {
  globalContext = self;
} else {
  globalContext = {};
}
if (typeof globalContext.setTimeout === "function") {
  cachedSetTimeout = setTimeout;
}
if (typeof globalContext.clearTimeout === "function") {
  cachedClearTimeout = clearTimeout;
}
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    return setTimeout(fun, 0);
  }
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e2) {
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    return clearTimeout(marker);
  }
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      return cachedClearTimeout.call(null, marker);
    } catch (e2) {
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
function nextTick(fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function() {
  this.fun.apply(null, this.array);
};
var title = "browser";
var platform = "browser";
var browser = true;
var argv = [];
var version = "";
var versions = {};
var release = {};
var config = {};
function noop() {
}
var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;
function binding(name) {
  throw new Error("process.binding is not supported");
}
function cwd() {
  return "/";
}
function chdir(dir) {
  throw new Error("process.chdir is not supported");
}
function umask() {
  return 0;
}
var performance = globalContext.performance || {};
var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
  return new Date().getTime();
};
function hrtime(previousTimestamp) {
  var clocktime = performanceNow.call(performance) * 1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor(clocktime % 1 * 1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds < 0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds, nanoseconds];
}
var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1e3;
}
var process = {
  nextTick,
  title,
  browser,
  env: {NODE_ENV: "production"},
  argv,
  version,
  versions,
  on,
  addListener,
  once,
  off,
  removeListener,
  removeAllListeners,
  emit,
  binding,
  cwd,
  chdir,
  umask,
  hrtime,
  platform,
  release,
  config,
  uptime
};
var transferable = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Transfer = exports.isTransferDescriptor = void 0;
  function isTransferable(thing) {
    if (!thing || typeof thing !== "object")
      return false;
    return true;
  }
  function isTransferDescriptor(thing) {
    return thing && typeof thing === "object" && thing[symbols.$transferable];
  }
  exports.isTransferDescriptor = isTransferDescriptor;
  function Transfer(payload, transferables) {
    if (!transferables) {
      if (!isTransferable(payload))
        throw Error();
      transferables = [payload];
    }
    return {
      [symbols.$transferable]: true,
      send: payload,
      transferables
    };
  }
  exports.Transfer = Transfer;
});
var messages = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.WorkerMessageType = exports.MasterMessageType = void 0;
  (function(MasterMessageType) {
    MasterMessageType["cancel"] = "cancel";
    MasterMessageType["run"] = "run";
  })(exports.MasterMessageType || (exports.MasterMessageType = {}));
  (function(WorkerMessageType) {
    WorkerMessageType["error"] = "error";
    WorkerMessageType["init"] = "init";
    WorkerMessageType["result"] = "result";
    WorkerMessageType["running"] = "running";
    WorkerMessageType["uncaughtError"] = "uncaughtError";
  })(exports.WorkerMessageType || (exports.WorkerMessageType = {}));
});
export {symbols as a, common as c, messages as m, process as p, serializers as s, transferable as t};
export default null;
