import { initGlobalAPI } from './globalAPI';
import { initMixin } from './init';
import { initLifeCycle } from './lifecycle';
import { initStateMixin } from './state';

/** Vue 实例的构造函数，options 为用户传入的选项（Vue2 的选项式API） */
function Vue(options) {
  // 初始化操作
  this._init(options);
}

// 将 _init 方法添加到 Vue 实例原型上，供 Vue 实例调用
initMixin(Vue);
initLifeCycle(Vue);
initStateMixin(Vue);
initGlobalAPI(Vue);

export default Vue;

// import Vue from './instance/index';
// import { initGlobalAPI } from './global-api/index';
// import { isServerRendering } from 'core/util/env';
// import { FunctionalRenderContext } from 'core/vdom/create-functional-component';

// initGlobalAPI(Vue);

// Object.defineProperty(Vue.prototype, '$isServer', {
//   get: isServerRendering
// });

// Object.defineProperty(Vue.prototype, '$ssrContext', {
//   get() {
//     /* istanbul ignore next */
//     return this.$vnode && this.$vnode.ssrContext;
//   }
// });

// // expose FunctionalRenderContext for ssr runtime helper installation
// Object.defineProperty(Vue, 'FunctionalRenderContext', {
//   value: FunctionalRenderContext
// });

// Vue.version = '__VERSION__';

// export default Vue;
