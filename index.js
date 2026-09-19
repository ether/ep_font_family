'use strict';

const fonts = require('./fonts');
const families = require('./font-families');
const {template} = require('ep_plugin_helpers');

exports.eejsBlock_editbarMenuLeft = template(
    'ep_font_family/templates/editbarButtons.ejs', {vars: () => ({fonts})});
exports.eejsBlock_dd_format = template(
    'ep_font_family/templates/fileMenu.ejs', {vars: () => ({fonts})});

// Server-side aceAttribClasses — maps font names to tag: prefix.
// The client maps the attribute in aceAttribsToClasses instead (it has
// to look at the attribute's value, which ATTRIB_CLASSES cannot), so
// this is kept only for consumers that read the server-side map.
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
    // Export the real CSS font stack, not the tag name: `font-family:
    // times-new-roman` names a typeface that does not exist, so Word /
    // LibreOffice / any HTML renderer silently falls back to the
    // default font and the formatting looks lost (#27).
    const family = families[font] || font.substring(4);
    lineContent = lineContent.replaceAll(`<${font}`, `<span style="font-family:${family}"`);
    lineContent = lineContent.replaceAll(`</${font}`, '</span');
  }
  context.lineContent = lineContent;
};
