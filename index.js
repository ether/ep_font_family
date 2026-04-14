'use strict';

const fonts = require('./fonts');
const {template} = require('ep_plugin_helpers');

exports.eejsBlock_editbarMenuLeft = template('ep_font_family/templates/editbarButtons.ejs');
exports.eejsBlock_dd_format = template('ep_font_family/templates/fileMenu.ejs');

// Server-side aceAttribClasses — maps font names to tag: prefix.
// This must match the client-side mapping exactly.
exports.aceAttribClasses = (hookName, attr, cb) => {
  for (const font of fonts) {
    attr[font] = `tag:${font}`;
  }
  return cb(attr);
};

exports.exportHtmlAdditionalTags = (hook, pad, cb) => cb(fonts);

exports.getLineHTMLForExport = async (hook, context) => {
  let lineContent = context.lineContent;
  for (const font of fonts) {
    if (!lineContent) break;
    const fontName = font.substring(4);
    lineContent = lineContent.replaceAll(`<${font}`, `<span style='font-family:${fontName}'`);
    lineContent = lineContent.replaceAll(`</${font}`, '</span');
  }
  context.lineContent = lineContent;
};
