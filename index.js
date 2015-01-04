var eejs = require('ep_etherpad-lite/node/eejs/');
var fonts = ["arial", "times-new-roman", "calibri", "helvetica", "courier", "palatino", "garamond", "bookman", "avant-garde"];
var fs = require('fs');

/******************** 
* UI 
*/ 
exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_font_family/templates/editbarButtons.ejs");
  return cb();
}

exports.eejsBlock_dd_format = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_font_family/templates/fileMenu.ejs");
  return cb();
}


/******************** 
* Editor
*/

// Allow <whatever> to be an attribute 
exports.aceAttribClasses = function(hook_name, attr, cb){
  for (var i in fonts){
    var font = fonts[i];
    attr[font] = 'tag:'+font;
  };
  cb(attr);
}

/******************** 
* Export
*/
// Include CSS for HTML export
exports.stylesForExport = function(hook, padId, cb){
  var cssPath = __dirname +'/static/css/iframe.css';
  fs.readFile(cssPath, function(err, data){
    cb(data);
  });  
};

// Add the props to be supported in export
exports.exportHtmlAdditionalTags = function(hook, pad, cb){
  cb(fonts);
};
