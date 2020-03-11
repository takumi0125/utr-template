
const g = window[ENV.projectName] = window[ENV.projectName] || {};
import Main from './Main'

window.addEventListener('DOMContentLoaded', ()=> {
  console.log('DOMContentLoaded')
  g.main = new Main();
});
