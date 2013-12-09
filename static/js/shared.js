var _ = require('ep_etherpad-lite/static/js/underscore');

var collectContentPre = function(hook, context){
  var fontFamily = /(?:^| )FontFamily:([A-Za-z0-9]*)/.exec(context.cls);
  if(fontFamily && fontFamily[1]){
    context.cc.doAttrib(context.state, fontFamily[0]);
  }
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
