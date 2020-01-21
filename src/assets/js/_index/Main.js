
const g = window[ENV.projectName] = window[ENV.projectName] || {};

import React from 'react';
import { render } from 'react-dom';
import Vue from 'vue';

import Module1 from './module1.tsx';
import Module2 from './module2.vue';

export default class Index {
  constructor() {
    console.log(ENV);

    // react
    render(<Module1/>, document.querySelector('.js-reactModule'));

    // vue
    new Vue({
      render: h => h(Module2),
    }).$mount('.js-vueModule')
  }
}
