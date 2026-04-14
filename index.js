'use strict';

const fonts = [
  'fontarial',
  'fontavant-garde',
  'fontbookman',
  'fontcalibri',
  'fontcourier',
  'fontgaramond',
  'fonthelvetica',
  'fontmonospace',
  'fontpalatino',
  'fonttimes-new-roman',
];

const eejs = require('ep_etherpad-lite/node/eejs/');

/** ******************
* UI
*/
exports.eejsBlock_editbarMenuLeft = (hookName, args, cb) => {
  args.content += eejs.require('ep_font_family/templates/editbarButtons.ejs');
  return cb();
};

exports.eejsBlock_dd_format = (hookName, args, cb) => {
  args.content += eejs.require('ep_font_family/templates/fileMenu.ejs');
  return cb();
};


/** ******************
* Editor
*/

// Allow <whatever> to be an attribute
exports.aceAttribClasses = (hookName, attr, cb) => {
  for (const font of fonts) {
    attr[font] = `tag:font${font}`;
  }
  return cb(attr);
};

/** ******************
* Export
*/

// Add the props to be supported in export
exports.exportHtmlAdditionalTags = (hook, pad, cb) => {
  return cb(fonts);
};

exports.getLineHTMLForExport = async (hook, context) => {
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

