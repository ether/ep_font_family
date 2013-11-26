var _ = require('ep_etherpad-lite/static/js/underscore');

var fonts = ['Arial', 'Times New Roman', 'Calibri'];

var collectContentPre = function(hook, context){
/*
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(fonts, tname);

  if(tagIndex >= 0){
    lineAttributes['font'] = fonts[tagIndex];
  }
*/
};

var collectContentPost = function(hook, context){
/*
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(fonts, tname);

  if(tagIndex >= 0){
    delete lineAttributes['font'];
  }
*/
};

exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;
