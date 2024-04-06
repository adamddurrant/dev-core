import './includes/submodule-one';

console.log('Module 1: Hello World');

if(module.hot) {
  module.hot.accept();
}