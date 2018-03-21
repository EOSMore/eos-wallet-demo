const rewireLess = require('react-app-rewire-less');
const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function override(config, env) {
  config = rewireLess(config, env);
  config = injectBabelPlugin(['import', { libraryName: 'antd-mobile', style: true }], config);
  return config;
};
