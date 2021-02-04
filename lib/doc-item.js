const qs = require('qs');

module.exports = function DocItem(cb) {

  const doc = {
    'DocItem': true, 
    title: '',
    params: {},
    query: {},
    res: {}
  };

  const assigner = {
    title(s) {
      doc.title = s; 
      return assigner; 
    },
    param(key, type, description, example) {
      doc.params[key] = {type, description, example}; 
      return assigner; 
    },
    query(key, type, description, example) {
      if (typeof example === 'object') {
        example = qs.stringify(example, {encode: false});
      } 
      doc.query[key] = {type, description, example}; 
      return assigner;
    },
    resData(key, type, description, example = '') {
      doc.res[key] = {type, description, example}; 
      return assigner; 
    },
    // shorthand alias functions
  };
    
  assigner.t = assigner.title;
  assigner.p = assigner.param;
  assigner.q = assigner.query;
  assigner.r = assigner.resData;

  if (cb) {
    cb(assigner);
  }

  return doc; 

};
