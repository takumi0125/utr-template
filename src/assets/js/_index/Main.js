
const g = window[ENV.projectName];

import React from 'react';
import { render } from 'react-dom';
import Vue from 'vue';

import Module1 from './module1.jsx';
import Module2 from './module2.vue';

export default class Index {
  constructor() {
    console.log('test2', ENV.mode);

    // react

    if (ENV.mode !== "production" && module.hot) {
      module.hot.accept("./module1.jsx", ()=> {
        render(<Module1/>, document.querySelector('.js-reactModule'));
      });
    }

    render(<Module1/>, document.querySelector('.js-reactModule'));

    // vue
    new Vue({
      render: h => h(Module2),
    }).$mount('.js-vueModule')
  }
}
