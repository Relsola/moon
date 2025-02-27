import Watcher from './observer/watcher';
import { createElement, createTextVNode } from "./vdom/index"
import { patch } from "./vdom/patch"


export function initLifeCycle(Vue) {
    // 生成 Vnode 节点
    Vue.prototype._c = function () {
        return createElement(this, ...arguments)
    }

    // 处理文本节点
    Vue.prototype._v = function () {
        return createTextVNode(this, ...arguments)
    }

    // 处理变量
    Vue.prototype._s = function (name) {
        if (typeof name === 'object') {
            return JSON.stringify(name) // 如果变量是对象，json序列化之后再返回
        }
        return name
    }

    // 挂载 render 函数到实例上
    Vue.prototype._render = function () {
        return this.$options.render.call(this) // 调用生成的render或者是传入的render，call 用于将this指向vm，使render内的变量向vm上取值
    }

    // 挂载 update 函数到实例上
    Vue.prototype._update = function (vnode) {
        const vm = this
        if (!this.el) this.$el = document.getElementById('app')
        const el = this.$el

        // 保存上一次渲染的vnode到vm上
        const preVnode = vm._vnode
        vm._vnode = vnode // 将组件第一次产生的vnode保存到实例上

        if (preVnode) {
            // 之前渲染过，传递上一次的vnode
            vm.$el = patch(preVnode, vnode)
        } else {
            //第一次渲染，传真实的el
            vm.$el = patch(el, vnode)
        }

        // 传入两个参数，第一个参数是真实 dom，第二个参数是虚拟 dom，patch 会按照 vnode 创建一个真实 dom，替换掉我们传入的 el
        // return vm.$el = patch(el, vnode) // patch 更新 或者 初始化渲染 方法
    }

}

export function mountComponent(vm, el) {
    // 将 el 对应的真实 dom 挂载到 vm 上，便于后面获取
    vm.$el = el
    // // 1. 调用 render 方法，获得虚拟 DOM
    // let vnode = vm._render()
    // console.log(vnode);

    // // 2. 根据虚拟 DOM，生成真实 DOM
    // vm._update(vnode)


    const updateComponent = () => {
        // 1. 调用 render 方法，获得虚拟 DOM
        let vnode = vm._render()

        // 2. 根据虚拟 DOM，生成真实 DOM
        vm._update(vnode)
    }
    const w = new Watcher(vm, updateComponent, true)

}

/**
 * 调用并执行vm上的钩子方法
 * @param {Object} vm Vue实例
 * @param {Array} hook vm的钩子方法
 */
export function callHook(vm, hook) {
    const handlers = vm.$options[hook]
    if (handlers) {
        handlers.forEach(fn => {
            fn.call(vm)
        });
    }
}
