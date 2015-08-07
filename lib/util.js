var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var _ = require('lodash');
var parse= Promise.promisify(require('csv-parse'));
var toCsv = Promise.promisify(require('json2csv'));
var helpers = require('./helpers.js');


exports.readCsv = function(csvPath){
  var file = fs.readFileSync(csvPath,'utf8');
  var headerKeys;
  var opts = {trim:true, columns:function(header){
    headerKeys = header;
  }};
  return parse(file, opts)
    .then(function(rows){
      return _.map(rows,function(r){
        return _.reduce(_.range(r.length),function(obj,i){
          obj[headerKeys[i]] = r[i];
          return obj;
        },{});
      });
    });
};

exports.writeCsv = function(rows,csvPath){
  var fields = _.keys(rows[0]);
  return toCsv({data:rows,fields:fields,del:';'}).then(function(csv){
    return fs.writeFileAsync(csvPath,csv);
  });
};

exports.mapDuplicates = function(rows,dedupeAttr,func){
  var grouped = _.groupBy(rows,dedupeAttr);
  return _.map(grouped,func);
};

exports.floatifyAttrs = function(rows,attrs){
  return _.map(rows,function(r){
    _.forEach(attrs,function(a){
      r[a] = helpers.floatify(r[a]);
    });
    return r;
  });
};
