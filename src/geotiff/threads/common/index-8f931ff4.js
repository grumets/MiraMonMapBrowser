import {p as process, c as common, t as transferable, m as messages} from "./messages-ff4dc575.js";
import {c as createCommonjsModule, g as getDefaultExportFromCjs, a as commonjsGlobal} from "./_commonjsHelpers-37fa8da4.js";
import require$$0 from "../imports/optimized/is-observable.js";
var implementation_browser = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  const isWorkerRuntime = function isWorkerRuntime2() {
    const isWindowContext = typeof self !== "undefined" && typeof Window !== "undefined" && self instanceof Window;
    return typeof self !== "undefined" && self.postMessage && !isWindowContext ? true : false;
  };
  const postMessageToMaster = function postMessageToMaster2(data, transferList) {
    self.postMessage(data, transferList);
  };
  const subscribeToMasterMessages = function subscribeToMasterMessages2(onMessage) {
    const messageHandler = (messageEvent) => {
      onMessage(messageEvent.data);
    };
    const unsubscribe = () => {
      self.removeEventListener("message", messageHandler);
    };
    self.addEventListener("message", messageHandler);
    return unsubscribe;
  };
  exports.default = {
    isWorkerRuntime,
    postMessageToMaster,
    subscribeToMasterMessages
  };
});
var worker = createCommonjsModule(function(module, exports) {
  var __awaiter = commonjsGlobal && commonjsGlobal.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.expose = exports.isWorkerRuntime = exports.Transfer = exports.registerSerializer = void 0;
  const is_observable_1 = __importDefault(require$$0);
  const implementation_1 = __importDefault(implementation_browser);
  var common_2 = common;
  Object.defineProperty(exports, "registerSerializer", {enumerable: true, get: function() {
    return common_2.registerSerializer;
  }});
  var transferable_2 = transferable;
  Object.defineProperty(exports, "Transfer", {enumerable: true, get: function() {
    return transferable_2.Transfer;
  }});
  exports.isWorkerRuntime = implementation_1.default.isWorkerRuntime;
  let exposeCalled = false;
  const activeSubscriptions = new Map();
  const isMasterJobCancelMessage = (thing) => thing && thing.type === messages.MasterMessageType.cancel;
  const isMasterJobRunMessage = (thing) => thing && thing.type === messages.MasterMessageType.run;
  const isObservable = (thing) => is_observable_1.default(thing) || isZenObservable(thing);
  function isZenObservable(thing) {
    return thing && typeof thing === "object" && typeof thing.subscribe === "function";
  }
  function deconstructTransfer(thing) {
    return transferable.isTransferDescriptor(thing) ? {payload: thing.send, transferables: thing.transferables} : {payload: thing, transferables: void 0};
  }
  function postFunctionInitMessage() {
    const initMessage = {
      type: messages.WorkerMessageType.init,
      exposed: {
        type: "function"
      }
    };
    implementation_1.default.postMessageToMaster(initMessage);
  }
  function postModuleInitMessage(methodNames) {
    const initMessage = {
      type: messages.WorkerMessageType.init,
      exposed: {
        type: "module",
        methods: methodNames
      }
    };
    implementation_1.default.postMessageToMaster(initMessage);
  }
  function postJobErrorMessage(uid, rawError) {
    const {payload: error, transferables} = deconstructTransfer(rawError);
    const errorMessage = {
      type: messages.WorkerMessageType.error,
      uid,
      error: common.serialize(error)
    };
    implementation_1.default.postMessageToMaster(errorMessage, transferables);
  }
  function postJobResultMessage(uid, completed, resultValue) {
    const {payload, transferables} = deconstructTransfer(resultValue);
    const resultMessage = {
      type: messages.WorkerMessageType.result,
      uid,
      complete: completed ? true : void 0,
      payload
    };
    implementation_1.default.postMessageToMaster(resultMessage, transferables);
  }
  function postJobStartMessage(uid, resultType) {
    const startMessage = {
      type: messages.WorkerMessageType.running,
      uid,
      resultType
    };
    implementation_1.default.postMessageToMaster(startMessage);
  }
  function postUncaughtErrorMessage(error) {
    try {
      const errorMessage = {
        type: messages.WorkerMessageType.uncaughtError,
        error: common.serialize(error)
      };
      implementation_1.default.postMessageToMaster(errorMessage);
    } catch (subError) {
      console.error("Not reporting uncaught error back to master thread as it occured while reporting an uncaught error already.\nLatest error:", subError, "\nOriginal error:", error);
    }
  }
  function runFunction(jobUID, fn, args) {
    return __awaiter(this, void 0, void 0, function* () {
      let syncResult;
      try {
        syncResult = fn(...args);
      } catch (error) {
        return postJobErrorMessage(jobUID, error);
      }
      const resultType = isObservable(syncResult) ? "observable" : "promise";
      postJobStartMessage(jobUID, resultType);
      if (isObservable(syncResult)) {
        const subscription = syncResult.subscribe((value) => postJobResultMessage(jobUID, false, common.serialize(value)), (error) => {
          postJobErrorMessage(jobUID, common.serialize(error));
          activeSubscriptions.delete(jobUID);
        }, () => {
          postJobResultMessage(jobUID, true);
          activeSubscriptions.delete(jobUID);
        });
        activeSubscriptions.set(jobUID, subscription);
      } else {
        try {
          const result = yield syncResult;
          postJobResultMessage(jobUID, true, common.serialize(result));
        } catch (error) {
          postJobErrorMessage(jobUID, common.serialize(error));
        }
      }
    });
  }
  function expose(exposed) {
    if (!implementation_1.default.isWorkerRuntime()) {
      throw Error("expose() called in the master thread.");
    }
    if (exposeCalled) {
      throw Error("expose() called more than once. This is not possible. Pass an object to expose() if you want to expose multiple functions.");
    }
    exposeCalled = true;
    if (typeof exposed === "function") {
      implementation_1.default.subscribeToMasterMessages((messageData) => {
        if (isMasterJobRunMessage(messageData) && !messageData.method) {
          runFunction(messageData.uid, exposed, messageData.args.map(common.deserialize));
        }
      });
      postFunctionInitMessage();
    } else if (typeof exposed === "object" && exposed) {
      implementation_1.default.subscribeToMasterMessages((messageData) => {
        if (isMasterJobRunMessage(messageData) && messageData.method) {
          runFunction(messageData.uid, exposed[messageData.method], messageData.args.map(common.deserialize));
        }
      });
      const methodNames = Object.keys(exposed).filter((key) => typeof exposed[key] === "function");
      postModuleInitMessage(methodNames);
    } else {
      throw Error(`Invalid argument passed to expose(). Expected a function or an object, got: ${exposed}`);
    }
    implementation_1.default.subscribeToMasterMessages((messageData) => {
      if (isMasterJobCancelMessage(messageData)) {
        const jobUID = messageData.uid;
        const subscription = activeSubscriptions.get(jobUID);
        if (subscription) {
          subscription.unsubscribe();
          activeSubscriptions.delete(jobUID);
        }
      }
    });
  }
  exports.expose = expose;
  if (typeof self !== "undefined" && typeof self.addEventListener === "function" && implementation_1.default.isWorkerRuntime()) {
    self.addEventListener("error", (event) => {
      setTimeout(() => postUncaughtErrorMessage(event.error || event), 250);
    });
    self.addEventListener("unhandledrejection", (event) => {
      const error = event.reason;
      if (error && typeof error.message === "string") {
        setTimeout(() => postUncaughtErrorMessage(error), 250);
      }
    });
  }
  if (typeof process !== "undefined" && typeof process.on === "function" && implementation_1.default.isWorkerRuntime()) {
    process.on("uncaughtException", (error) => {
      setTimeout(() => postUncaughtErrorMessage(error), 250);
    });
    process.on("unhandledRejection", (error) => {
      if (error && typeof error.message === "string") {
        setTimeout(() => postUncaughtErrorMessage(error), 250);
      }
    });
  }
});
var WorkerContext = /* @__PURE__ */ getDefaultExportFromCjs(worker);
export {WorkerContext as W, worker as w};
export default null;
