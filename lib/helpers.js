var Promise = require('bluebird');
var _ = require('lodash');




exports.floatify = function(str){
  return Number(str.replace(/[^0-9\.]+/g,""));
};
