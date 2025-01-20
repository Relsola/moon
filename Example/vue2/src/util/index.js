/** 空函数 */
export function noop() {}

const hasOwnProperty = Object.prototype.hasOwnProperty;
/** 检查某个对象是否具有该属性 */
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
