import { toSafe } from "./_util/arrayIterator.js";
import { convertToNumber, roundToFloat16Bits } from "./_util/converter.js";
import {
  DataViewPrototypeGetUint16,
  DataViewPrototypeSetUint16,
} from "./_util/primordials.js";

/**
 * returns an unsigned 16-bit float at the specified byte offset from the start of the DataView.
 *
 * @param {DataView} dataView
 * @param {number} byteOffset
 * @param {[boolean]} opts
 * @returns {number}
 */
export function getFloat16(dataView, byteOffset, ...opts) {
  return convertToNumber(
    DataViewPrototypeGetUint16(dataView, byteOffset, ...toSafe(opts))
  );
}

/**
 * stores an unsigned 16-bit float value at the specified byte offset from the start of the DataView.
 *
 * @param {DataView} dataView
 * @param {number} byteOffset
 * @param {number} value
 * @param {[boolean]} opts
 */
export function setFloat16(dataView, byteOffset, value, ...opts) {
  return DataViewPrototypeSetUint16(
    dataView,
    byteOffset,
    roundToFloat16Bits(value),
    ...toSafe(opts)
  );
}
