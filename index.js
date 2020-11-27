const eejs = require('ep_etherpad-lite/node/eejs/');
const fonts = ['fontarial', 'fontavant-garde', 'fontbookman', 'fontcalibri', 'fontcourier', 'fontgaramond', 'fonthelvetica', 'fontmonospace', 'fontpalatino', 'fonttimes-new-roman'];
const fs = require('fs');

/** ******************
* UI
*/
exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  args.content += eejs.require('ep_font_family/templates/editbarButtons.ejs');
  return cb();
};

exports.eejsBlock_dd_format = function (hook_name, args, cb) {
  args.content += eejs.require('ep_font_family/templates/fileMenu.ejs');
  return cb();
};


/** ******************
* Editor
*/

// Allow <whatever> to be an attribute
exports.aceAttribClasses = function (hook_name, attr, cb) {
  for (const i in fonts) {
    const font = fonts[i];
    attr[font] = `tag:font${font}`;
  }
  cb(attr);
};

/** ******************
* Export
*/

// Add the props to be supported in export
exports.exportHtmlAdditionalTags = function (hook, pad, cb) {
  cb(fonts);
};

exports.getLineHTMLForExport = function (hook, context, cb) {
  let lineContent = context.lineContent;
  fonts.forEach((font) => {
    if (lineContent) {
      const fontName = font.substring(4);
      lineContent = lineContent.replaceAll(`<${font}`, `<span style='font-family:${fontName}'`);
      lineContent = lineContent.replaceAll(`</${font}`, '</span');
    }
  });
  context.lineContent = lineContent;
};

String.prototype.replaceAll = function (str1, str2, ignore) {
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'), (ignore ? 'gi' : 'g')), (typeof (str2) === 'string') ? str2.replace(/\$/g, '$$$$') : str2);
};
