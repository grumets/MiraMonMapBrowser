var isObservable = (value) => {
  if (!value) {
    return false;
  }
  if (typeof Symbol.observable === "symbol" && typeof value[Symbol.observable] === "function") {
    return value === value[Symbol.observable]();
  }
  if (typeof value["@@observable"] === "function") {
    return value === value["@@observable"]();
  }
  return false;
};
export default isObservable;
