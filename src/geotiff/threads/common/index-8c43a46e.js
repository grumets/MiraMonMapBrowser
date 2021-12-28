import {c as createCommonjsModule, a as commonjsGlobal} from "./_commonjsHelpers-37fa8da4.js";
import require$$0 from "../imports/optimized/debug.js";
import "../imports/optimized/observable-fns.js";
import {a as symbols, m as messages, c as common, t as transferable, p as process} from "./messages-ff4dc575.js";
import {o as observable_fns_1} from "./_observable-fns_commonjs-external-90672bf0.js";
var getBundleUrl_browser = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.getBundleURL = exports.getBaseURL = void 0;
  let bundleURL;
  function getBundleURLCached() {
    if (!bundleURL) {
      bundleURL = getBundleURL();
    }
    return bundleURL;
  }
  exports.getBundleURL = getBundleURLCached;
  function getBundleURL() {
    try {
      throw new Error();
    } catch (err) {
      const matches = ("" + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
      if (matches) {
        return getBaseURL(matches[0]);
      }
    }
    return "/";
  }
  function getBaseURL(url) {
    return ("" + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, "$1") + "/";
  }
  exports.getBaseURL = getBaseURL;
});
var implementation_browser = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.isWorkerRuntime = exports.getWorkerImplementation = exports.defaultPoolSize = void 0;
  exports.defaultPoolSize = typeof navigator !== "undefined" && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4;
  const isAbsoluteURL = (value) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);
  function createSourceBlobURL(code) {
    const blob = new Blob([code], {type: "application/javascript"});
    return URL.createObjectURL(blob);
  }
  function selectWorkerImplementation() {
    if (typeof Worker === "undefined") {
      return class NoWebWorker {
        constructor() {
          throw Error("No web worker implementation available. You might have tried to spawn a worker within a worker in a browser that doesn't support workers in workers.");
        }
      };
    }
    class WebWorker extends Worker {
      constructor(url, options) {
        var _a, _b;
        if (typeof url === "string" && options && options._baseURL) {
          url = new URL(url, options._baseURL);
        } else if (typeof url === "string" && !isAbsoluteURL(url) && getBundleUrl_browser.getBundleURL().match(/^file:\/\//i)) {
          url = new URL(url, getBundleUrl_browser.getBundleURL().replace(/\/[^\/]+$/, "/"));
          if ((_a = options === null || options === void 0 ? void 0 : options.CORSWorkaround) !== null && _a !== void 0 ? _a : true) {
            url = createSourceBlobURL(`importScripts(${JSON.stringify(url)});`);
          }
        }
        if (typeof url === "string" && isAbsoluteURL(url)) {
          if ((_b = options === null || options === void 0 ? void 0 : options.CORSWorkaround) !== null && _b !== void 0 ? _b : true) {
            url = createSourceBlobURL(`importScripts(${JSON.stringify(url)});`);
          }
        }
        super(url, options);
      }
    }
    class BlobWorker extends WebWorker {
      constructor(blob, options) {
        const url = window.URL.createObjectURL(blob);
        super(url, options);
      }
      static fromText(source, options) {
        const blob = new window.Blob([source], {type: "text/javascript"});
        return new BlobWorker(blob, options);
      }
    }
    return {
      blob: BlobWorker,
      default: WebWorker
    };
  }
  let implementation;
  function getWorkerImplementation() {
    if (!implementation) {
      implementation = selectWorkerImplementation();
    }
    return implementation;
  }
  exports.getWorkerImplementation = getWorkerImplementation;
  function isWorkerRuntime() {
    const isWindowContext = typeof self !== "undefined" && typeof Window !== "undefined" && self instanceof Window;
    return typeof self !== "undefined" && self.postMessage && !isWindowContext ? true : false;
  }
  exports.isWorkerRuntime = isWorkerRuntime;
});
var ponyfills = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.allSettled = void 0;
  function allSettled(values) {
    return Promise.all(values.map((item) => {
      const onFulfill = (value) => {
        return {status: "fulfilled", value};
      };
      const onReject = (reason) => {
        return {status: "rejected", reason};
      };
      const itemPromise = Promise.resolve(item);
      try {
        return itemPromise.then(onFulfill, onReject);
      } catch (error) {
        return Promise.reject(error);
      }
    }));
  }
  exports.allSettled = allSettled;
});
var poolTypes = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.PoolEventType = void 0;
  (function(PoolEventType) {
    PoolEventType["initialized"] = "initialized";
    PoolEventType["taskCanceled"] = "taskCanceled";
    PoolEventType["taskCompleted"] = "taskCompleted";
    PoolEventType["taskFailed"] = "taskFailed";
    PoolEventType["taskQueued"] = "taskQueued";
    PoolEventType["taskQueueDrained"] = "taskQueueDrained";
    PoolEventType["taskStart"] = "taskStart";
    PoolEventType["terminated"] = "terminated";
  })(exports.PoolEventType || (exports.PoolEventType = {}));
});
var thread = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Thread = void 0;
  function fail(message) {
    throw Error(message);
  }
  exports.Thread = {
    errors(thread2) {
      return thread2[symbols.$errors] || fail("Error observable not found. Make sure to pass a thread instance as returned by the spawn() promise.");
    },
    events(thread2) {
      return thread2[symbols.$events] || fail("Events observable not found. Make sure to pass a thread instance as returned by the spawn() promise.");
    },
    terminate(thread2) {
      return thread2[symbols.$terminate]();
    }
  };
});
var pool = createCommonjsModule(function(module, exports) {
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
  exports.Pool = exports.Thread = exports.PoolEventType = void 0;
  const debug_1 = __importDefault(require$$0);
  Object.defineProperty(exports, "PoolEventType", {enumerable: true, get: function() {
    return poolTypes.PoolEventType;
  }});
  Object.defineProperty(exports, "Thread", {enumerable: true, get: function() {
    return thread.Thread;
  }});
  let nextPoolID = 1;
  function createArray(size) {
    const array = [];
    for (let index = 0; index < size; index++) {
      array.push(index);
    }
    return array;
  }
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function flatMap(array, mapper) {
    return array.reduce((flattened, element) => [...flattened, ...mapper(element)], []);
  }
  function slugify(text) {
    return text.replace(/\W/g, " ").trim().replace(/\s+/g, "-");
  }
  function spawnWorkers(spawnWorker, count) {
    return createArray(count).map(() => ({
      init: spawnWorker(),
      runningTasks: []
    }));
  }
  class WorkerPool {
    constructor(spawnWorker, optionsOrSize) {
      this.eventSubject = new observable_fns_1.Subject();
      this.initErrors = [];
      this.isClosing = false;
      this.nextTaskID = 1;
      this.taskQueue = [];
      const options = typeof optionsOrSize === "number" ? {size: optionsOrSize} : optionsOrSize || {};
      const {size = implementation_browser.defaultPoolSize} = options;
      this.debug = debug_1.default(`threads:pool:${slugify(options.name || String(nextPoolID++))}`);
      this.options = options;
      this.workers = spawnWorkers(spawnWorker, size);
      this.eventObservable = observable_fns_1.multicast(observable_fns_1.Observable.from(this.eventSubject));
      Promise.all(this.workers.map((worker) => worker.init)).then(() => this.eventSubject.next({
        type: poolTypes.PoolEventType.initialized,
        size: this.workers.length
      }), (error) => {
        this.debug("Error while initializing pool worker:", error);
        this.eventSubject.error(error);
        this.initErrors.push(error);
      });
    }
    findIdlingWorker() {
      const {concurrency = 1} = this.options;
      return this.workers.find((worker) => worker.runningTasks.length < concurrency);
    }
    runPoolTask(worker, task) {
      return __awaiter(this, void 0, void 0, function* () {
        const workerID = this.workers.indexOf(worker) + 1;
        this.debug(`Running task #${task.id} on worker #${workerID}...`);
        this.eventSubject.next({
          type: poolTypes.PoolEventType.taskStart,
          taskID: task.id,
          workerID
        });
        try {
          const returnValue = yield task.run(yield worker.init);
          this.debug(`Task #${task.id} completed successfully`);
          this.eventSubject.next({
            type: poolTypes.PoolEventType.taskCompleted,
            returnValue,
            taskID: task.id,
            workerID
          });
        } catch (error) {
          this.debug(`Task #${task.id} failed`);
          this.eventSubject.next({
            type: poolTypes.PoolEventType.taskFailed,
            taskID: task.id,
            error,
            workerID
          });
        }
      });
    }
    run(worker, task) {
      return __awaiter(this, void 0, void 0, function* () {
        const runPromise = (() => __awaiter(this, void 0, void 0, function* () {
          const removeTaskFromWorkersRunningTasks = () => {
            worker.runningTasks = worker.runningTasks.filter((someRunPromise) => someRunPromise !== runPromise);
          };
          yield delay(0);
          try {
            yield this.runPoolTask(worker, task);
          } finally {
            removeTaskFromWorkersRunningTasks();
            if (!this.isClosing) {
              this.scheduleWork();
            }
          }
        }))();
        worker.runningTasks.push(runPromise);
      });
    }
    scheduleWork() {
      this.debug(`Attempt de-queueing a task in order to run it...`);
      const availableWorker = this.findIdlingWorker();
      if (!availableWorker)
        return;
      const nextTask = this.taskQueue.shift();
      if (!nextTask) {
        this.debug(`Task queue is empty`);
        this.eventSubject.next({type: poolTypes.PoolEventType.taskQueueDrained});
        return;
      }
      this.run(availableWorker, nextTask);
    }
    taskCompletion(taskID) {
      return new Promise((resolve, reject) => {
        const eventSubscription = this.events().subscribe((event) => {
          if (event.type === poolTypes.PoolEventType.taskCompleted && event.taskID === taskID) {
            eventSubscription.unsubscribe();
            resolve(event.returnValue);
          } else if (event.type === poolTypes.PoolEventType.taskFailed && event.taskID === taskID) {
            eventSubscription.unsubscribe();
            reject(event.error);
          } else if (event.type === poolTypes.PoolEventType.terminated) {
            eventSubscription.unsubscribe();
            reject(Error("Pool has been terminated before task was run."));
          }
        });
      });
    }
    settled(allowResolvingImmediately = false) {
      return __awaiter(this, void 0, void 0, function* () {
        const getCurrentlyRunningTasks = () => flatMap(this.workers, (worker) => worker.runningTasks);
        const taskFailures = [];
        const failureSubscription = this.eventObservable.subscribe((event) => {
          if (event.type === poolTypes.PoolEventType.taskFailed) {
            taskFailures.push(event.error);
          }
        });
        if (this.initErrors.length > 0) {
          return Promise.reject(this.initErrors[0]);
        }
        if (allowResolvingImmediately && this.taskQueue.length === 0) {
          yield ponyfills.allSettled(getCurrentlyRunningTasks());
          return taskFailures;
        }
        yield new Promise((resolve, reject) => {
          const subscription = this.eventObservable.subscribe({
            next(event) {
              if (event.type === poolTypes.PoolEventType.taskQueueDrained) {
                subscription.unsubscribe();
                resolve(void 0);
              }
            },
            error: reject
          });
        });
        yield ponyfills.allSettled(getCurrentlyRunningTasks());
        failureSubscription.unsubscribe();
        return taskFailures;
      });
    }
    completed(allowResolvingImmediately = false) {
      return __awaiter(this, void 0, void 0, function* () {
        const settlementPromise = this.settled(allowResolvingImmediately);
        const earlyExitPromise = new Promise((resolve, reject) => {
          const subscription = this.eventObservable.subscribe({
            next(event) {
              if (event.type === poolTypes.PoolEventType.taskQueueDrained) {
                subscription.unsubscribe();
                resolve(settlementPromise);
              } else if (event.type === poolTypes.PoolEventType.taskFailed) {
                subscription.unsubscribe();
                reject(event.error);
              }
            },
            error: reject
          });
        });
        const errors = yield Promise.race([
          settlementPromise,
          earlyExitPromise
        ]);
        if (errors.length > 0) {
          throw errors[0];
        }
      });
    }
    events() {
      return this.eventObservable;
    }
    queue(taskFunction) {
      const {maxQueuedJobs = Infinity} = this.options;
      if (this.isClosing) {
        throw Error(`Cannot schedule pool tasks after terminate() has been called.`);
      }
      if (this.initErrors.length > 0) {
        throw this.initErrors[0];
      }
      const taskID = this.nextTaskID++;
      const taskCompletion = this.taskCompletion(taskID);
      taskCompletion.catch((error) => {
        this.debug(`Task #${taskID} errored:`, error);
      });
      const task = {
        id: taskID,
        run: taskFunction,
        cancel: () => {
          if (this.taskQueue.indexOf(task) === -1)
            return;
          this.taskQueue = this.taskQueue.filter((someTask) => someTask !== task);
          this.eventSubject.next({
            type: poolTypes.PoolEventType.taskCanceled,
            taskID: task.id
          });
        },
        then: taskCompletion.then.bind(taskCompletion)
      };
      if (this.taskQueue.length >= maxQueuedJobs) {
        throw Error("Maximum number of pool tasks queued. Refusing to queue another one.\nThis usually happens for one of two reasons: We are either at peak workload right now or some tasks just won't finish, thus blocking the pool.");
      }
      this.debug(`Queueing task #${task.id}...`);
      this.taskQueue.push(task);
      this.eventSubject.next({
        type: poolTypes.PoolEventType.taskQueued,
        taskID: task.id
      });
      this.scheduleWork();
      return task;
    }
    terminate(force) {
      return __awaiter(this, void 0, void 0, function* () {
        this.isClosing = true;
        if (!force) {
          yield this.completed(true);
        }
        this.eventSubject.next({
          type: poolTypes.PoolEventType.terminated,
          remainingQueue: [...this.taskQueue]
        });
        this.eventSubject.complete();
        yield Promise.all(this.workers.map((worker) => __awaiter(this, void 0, void 0, function* () {
          return thread.Thread.terminate(yield worker.init);
        })));
      });
    }
  }
  WorkerPool.EventType = poolTypes.PoolEventType;
  function PoolConstructor(spawnWorker, optionsOrSize) {
    return new WorkerPool(spawnWorker, optionsOrSize);
  }
  PoolConstructor.EventType = poolTypes.PoolEventType;
  exports.Pool = PoolConstructor;
});
var promise = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.createPromiseWithResolver = void 0;
  const doNothing = () => void 0;
  function createPromiseWithResolver() {
    let alreadyResolved = false;
    let resolvedTo;
    let resolver = doNothing;
    const promise2 = new Promise((resolve) => {
      if (alreadyResolved) {
        resolve(resolvedTo);
      } else {
        resolver = resolve;
      }
    });
    const exposedResolver = (value) => {
      alreadyResolved = true;
      resolvedTo = value;
      resolver(resolvedTo);
    };
    return [promise2, exposedResolver];
  }
  exports.createPromiseWithResolver = createPromiseWithResolver;
});
var master = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.WorkerEventType = void 0;
  (function(WorkerEventType) {
    WorkerEventType["internalError"] = "internalError";
    WorkerEventType["message"] = "message";
    WorkerEventType["termination"] = "termination";
  })(exports.WorkerEventType || (exports.WorkerEventType = {}));
});
var observablePromise = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.ObservablePromise = void 0;
  const doNothing = () => void 0;
  const returnInput = (input) => input;
  const runDeferred = (fn) => Promise.resolve().then(fn);
  function fail(error) {
    throw error;
  }
  function isThenable(thing) {
    return thing && typeof thing.then === "function";
  }
  class ObservablePromise extends observable_fns_1.Observable {
    constructor(init) {
      super((originalObserver) => {
        const self2 = this;
        const observer = Object.assign(Object.assign({}, originalObserver), {
          complete() {
            originalObserver.complete();
            self2.onCompletion();
          },
          error(error) {
            originalObserver.error(error);
            self2.onError(error);
          },
          next(value) {
            originalObserver.next(value);
            self2.onNext(value);
          }
        });
        try {
          this.initHasRun = true;
          return init(observer);
        } catch (error) {
          observer.error(error);
        }
      });
      this.initHasRun = false;
      this.fulfillmentCallbacks = [];
      this.rejectionCallbacks = [];
      this.firstValueSet = false;
      this.state = "pending";
    }
    onNext(value) {
      if (!this.firstValueSet) {
        this.firstValue = value;
        this.firstValueSet = true;
      }
    }
    onError(error) {
      this.state = "rejected";
      this.rejection = error;
      for (const onRejected of this.rejectionCallbacks) {
        runDeferred(() => onRejected(error));
      }
    }
    onCompletion() {
      this.state = "fulfilled";
      for (const onFulfilled of this.fulfillmentCallbacks) {
        runDeferred(() => onFulfilled(this.firstValue));
      }
    }
    then(onFulfilledRaw, onRejectedRaw) {
      const onFulfilled = onFulfilledRaw || returnInput;
      const onRejected = onRejectedRaw || fail;
      let onRejectedCalled = false;
      return new Promise((resolve, reject) => {
        const rejectionCallback = (error) => {
          if (onRejectedCalled)
            return;
          onRejectedCalled = true;
          try {
            resolve(onRejected(error));
          } catch (anotherError) {
            reject(anotherError);
          }
        };
        const fulfillmentCallback = (value) => {
          try {
            resolve(onFulfilled(value));
          } catch (error) {
            rejectionCallback(error);
          }
        };
        if (!this.initHasRun) {
          this.subscribe({error: rejectionCallback});
        }
        if (this.state === "fulfilled") {
          return resolve(onFulfilled(this.firstValue));
        }
        if (this.state === "rejected") {
          onRejectedCalled = true;
          return resolve(onRejected(this.rejection));
        }
        this.fulfillmentCallbacks.push(fulfillmentCallback);
        this.rejectionCallbacks.push(rejectionCallback);
      });
    }
    catch(onRejected) {
      return this.then(void 0, onRejected);
    }
    finally(onCompleted) {
      const handler = onCompleted || doNothing;
      return this.then((value) => {
        handler();
        return value;
      }, () => handler());
    }
    static from(thing) {
      if (isThenable(thing)) {
        return new ObservablePromise((observer) => {
          const onFulfilled = (value) => {
            observer.next(value);
            observer.complete();
          };
          const onRejected = (error) => {
            observer.error(error);
          };
          thing.then(onFulfilled, onRejected);
        });
      } else {
        return super.from(thing);
      }
    }
  }
  exports.ObservablePromise = ObservablePromise;
});
var invocationProxy = createCommonjsModule(function(module, exports) {
  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.createProxyModule = exports.createProxyFunction = void 0;
  const debug_1 = __importDefault(require$$0);
  const debugMessages = debug_1.default("threads:master:messages");
  let nextJobUID = 1;
  const dedupe = (array) => Array.from(new Set(array));
  const isJobErrorMessage = (data) => data && data.type === messages.WorkerMessageType.error;
  const isJobResultMessage = (data) => data && data.type === messages.WorkerMessageType.result;
  const isJobStartMessage = (data) => data && data.type === messages.WorkerMessageType.running;
  function createObservableForJob(worker, jobUID) {
    return new observable_fns_1.Observable((observer) => {
      let asyncType;
      const messageHandler = (event) => {
        debugMessages("Message from worker:", event.data);
        if (!event.data || event.data.uid !== jobUID)
          return;
        if (isJobStartMessage(event.data)) {
          asyncType = event.data.resultType;
        } else if (isJobResultMessage(event.data)) {
          if (asyncType === "promise") {
            if (typeof event.data.payload !== "undefined") {
              observer.next(common.deserialize(event.data.payload));
            }
            observer.complete();
            worker.removeEventListener("message", messageHandler);
          } else {
            if (event.data.payload) {
              observer.next(common.deserialize(event.data.payload));
            }
            if (event.data.complete) {
              observer.complete();
              worker.removeEventListener("message", messageHandler);
            }
          }
        } else if (isJobErrorMessage(event.data)) {
          const error = common.deserialize(event.data.error);
          if (asyncType === "promise" || !asyncType) {
            observer.error(error);
          } else {
            observer.error(error);
          }
          worker.removeEventListener("message", messageHandler);
        }
      };
      worker.addEventListener("message", messageHandler);
      return () => {
        if (asyncType === "observable" || !asyncType) {
          const cancelMessage = {
            type: messages.MasterMessageType.cancel,
            uid: jobUID
          };
          worker.postMessage(cancelMessage);
        }
        worker.removeEventListener("message", messageHandler);
      };
    });
  }
  function prepareArguments(rawArgs) {
    if (rawArgs.length === 0) {
      return {
        args: [],
        transferables: []
      };
    }
    const args = [];
    const transferables = [];
    for (const arg of rawArgs) {
      if (transferable.isTransferDescriptor(arg)) {
        args.push(common.serialize(arg.send));
        transferables.push(...arg.transferables);
      } else {
        args.push(common.serialize(arg));
      }
    }
    return {
      args,
      transferables: transferables.length === 0 ? transferables : dedupe(transferables)
    };
  }
  function createProxyFunction(worker, method) {
    return (...rawArgs) => {
      const uid = nextJobUID++;
      const {args, transferables} = prepareArguments(rawArgs);
      const runMessage = {
        type: messages.MasterMessageType.run,
        uid,
        method,
        args
      };
      debugMessages("Sending command to run function to worker:", runMessage);
      try {
        worker.postMessage(runMessage, transferables);
      } catch (error) {
        return observablePromise.ObservablePromise.from(Promise.reject(error));
      }
      return observablePromise.ObservablePromise.from(observable_fns_1.multicast(createObservableForJob(worker, uid)));
    };
  }
  exports.createProxyFunction = createProxyFunction;
  function createProxyModule(worker, methodNames) {
    const proxy = {};
    for (const methodName of methodNames) {
      proxy[methodName] = createProxyFunction(worker, methodName);
    }
    return proxy;
  }
  exports.createProxyModule = createProxyModule;
});
var spawn_1 = createCommonjsModule(function(module, exports) {
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
  exports.spawn = void 0;
  const debug_1 = __importDefault(require$$0);
  const debugMessages = debug_1.default("threads:master:messages");
  const debugSpawn = debug_1.default("threads:master:spawn");
  const debugThreadUtils = debug_1.default("threads:master:thread-utils");
  const isInitMessage = (data) => data && data.type === "init";
  const isUncaughtErrorMessage = (data) => data && data.type === "uncaughtError";
  const initMessageTimeout = typeof process !== "undefined" && process.env.THREADS_WORKER_INIT_TIMEOUT ? Number.parseInt(process.env.THREADS_WORKER_INIT_TIMEOUT, 10) : 1e4;
  function withTimeout(promise2, timeoutInMs, errorMessage) {
    return __awaiter(this, void 0, void 0, function* () {
      let timeoutHandle;
      const timeout = new Promise((resolve, reject) => {
        timeoutHandle = setTimeout(() => reject(Error(errorMessage)), timeoutInMs);
      });
      const result = yield Promise.race([
        promise2,
        timeout
      ]);
      clearTimeout(timeoutHandle);
      return result;
    });
  }
  function receiveInitMessage(worker) {
    return new Promise((resolve, reject) => {
      const messageHandler = (event) => {
        debugMessages("Message from worker before finishing initialization:", event.data);
        if (isInitMessage(event.data)) {
          worker.removeEventListener("message", messageHandler);
          resolve(event.data);
        } else if (isUncaughtErrorMessage(event.data)) {
          worker.removeEventListener("message", messageHandler);
          reject(common.deserialize(event.data.error));
        }
      };
      worker.addEventListener("message", messageHandler);
    });
  }
  function createEventObservable(worker, workerTermination) {
    return new observable_fns_1.Observable((observer) => {
      const messageHandler = (messageEvent) => {
        const workerEvent = {
          type: master.WorkerEventType.message,
          data: messageEvent.data
        };
        observer.next(workerEvent);
      };
      const rejectionHandler = (errorEvent) => {
        debugThreadUtils("Unhandled promise rejection event in thread:", errorEvent);
        const workerEvent = {
          type: master.WorkerEventType.internalError,
          error: Error(errorEvent.reason)
        };
        observer.next(workerEvent);
      };
      worker.addEventListener("message", messageHandler);
      worker.addEventListener("unhandledrejection", rejectionHandler);
      workerTermination.then(() => {
        const terminationEvent = {
          type: master.WorkerEventType.termination
        };
        worker.removeEventListener("message", messageHandler);
        worker.removeEventListener("unhandledrejection", rejectionHandler);
        observer.next(terminationEvent);
        observer.complete();
      });
    });
  }
  function createTerminator(worker) {
    const [termination, resolver] = promise.createPromiseWithResolver();
    const terminate = () => __awaiter(this, void 0, void 0, function* () {
      debugThreadUtils("Terminating worker");
      yield worker.terminate();
      resolver();
    });
    return {terminate, termination};
  }
  function setPrivateThreadProps(raw, worker, workerEvents, terminate) {
    const workerErrors = workerEvents.filter((event) => event.type === master.WorkerEventType.internalError).map((errorEvent) => errorEvent.error);
    return Object.assign(raw, {
      [symbols.$errors]: workerErrors,
      [symbols.$events]: workerEvents,
      [symbols.$terminate]: terminate,
      [symbols.$worker]: worker
    });
  }
  function spawn(worker, options) {
    return __awaiter(this, void 0, void 0, function* () {
      debugSpawn("Initializing new thread");
      const timeout = options && options.timeout ? options.timeout : initMessageTimeout;
      const initMessage = yield withTimeout(receiveInitMessage(worker), timeout, `Timeout: Did not receive an init message from worker after ${timeout}ms. Make sure the worker calls expose().`);
      const exposed = initMessage.exposed;
      const {termination, terminate} = createTerminator(worker);
      const events = createEventObservable(worker, termination);
      if (exposed.type === "function") {
        const proxy = invocationProxy.createProxyFunction(worker);
        return setPrivateThreadProps(proxy, worker, events, terminate);
      } else if (exposed.type === "module") {
        const proxy = invocationProxy.createProxyModule(worker, exposed.methods);
        return setPrivateThreadProps(proxy, worker, events, terminate);
      } else {
        const type = exposed.type;
        throw Error(`Worker init message states unexpected type of expose(): ${type}`);
      }
    });
  }
  exports.spawn = spawn;
});
var master$1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Worker = exports.BlobWorker = exports.isWorkerRuntime = exports.Thread = exports.spawn = exports.Pool = void 0;
  Object.defineProperty(exports, "isWorkerRuntime", {enumerable: true, get: function() {
    return implementation_browser.isWorkerRuntime;
  }});
  Object.defineProperty(exports, "Pool", {enumerable: true, get: function() {
    return pool.Pool;
  }});
  Object.defineProperty(exports, "spawn", {enumerable: true, get: function() {
    return spawn_1.spawn;
  }});
  Object.defineProperty(exports, "Thread", {enumerable: true, get: function() {
    return thread.Thread;
  }});
  exports.BlobWorker = implementation_browser.getWorkerImplementation().blob;
  exports.Worker = implementation_browser.getWorkerImplementation().default;
});
export {master$1 as m};
export default null;
