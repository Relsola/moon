import { initMixin } from './init.js';
import { stateMixin } from './state';
import { renderMixin } from './render';
import { eventsMixin } from './events';
import { lifecycleMixin } from './lifecycle';

/** Vue 实例的构造函数，options 为用户传入的选项 */
function Vue(options) {
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;
