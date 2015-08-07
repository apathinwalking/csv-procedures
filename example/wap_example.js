var Promise = require('bluebird');
var util = require('../lib/util.js');
var helpers = require('../lib/helpers.js');
var _ = require('lodash');
var path = require("path");
var csvPath = '/home/poco/Downloads/wap.csv';
var outPath = '/home/poco/Downloads/wap_ids.csv';
var outPath2 = '/home/poco/Downloads/wap_collapsed.csv';

util.readCsv(csvPath).then(function(results){
  return util.floatifyAttrs(results,['Amount']);
}).then(function(results){
  var id = 0;
  var deduped = util.mapDuplicates(results,'tidy_address',function(rows,key){
    var obj = {};
    obj.id = id;
    id+=1;
    obj.tidy_address = key;
    obj['Case number'] = _.pluck(rows,'Case number').toString();
    obj['Vendor'] = _.pluck(rows,'Vendor').toString();
    obj['Amount'] = _.map(_.pluck(rows,'Amount'),function(a){
      return "\'" + a + "\'";
    }).toString();
    obj['Funding Source'] = _.pluck(rows,'Funding Source').toString();
    obj['Date'] = _.pluck(rows,'Date').toString();
    obj['num_matches'] = rows.length;
    obj['Total Amount'] = _.sum(rows,'Amount');
    return obj;
  });


  var reg = _.map(results,function(r){
    r.id = _.pluck(_.where(deduped,{'tidy_address':r.tidy_address}),'id')[0];
    return r;
  });

  return util.writeCsv(deduped,outPath)
    .then(function(results){
      console.log("DONE 1 ");
      return util.writeCsv(reg,outPath2);
    });


}).then(function(results){
  console.log("FINISHED");
});
