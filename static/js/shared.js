'use strict';

const {tagAttribute} = require('ep_plugin_helpers/attributes');
const fonts = require('../../fonts');

const fontFamily = tagAttribute({tags: fonts});

// Map a CSS font-family value (e.g. "Arial", "'Times New Roman'",
// "Helvetica Neue, sans-serif") back to one of the toolbar tag names
// (e.g. "fontarial", "fonttimes-new-roman"). The toolbar tag names
// are the prefix "font" plus the CSS family lower-cased and
// hyphen-spaced. Handles quoted values, the first font in a fallback
// list, and trailing CSS keywords like "monospace"/"sans-serif".
const FONT_NAMES = new Set(fonts);
const STYLE_FONT_FAMILY_RE = /(?:^|;|\s)font-family\s*:\s*([^;]+?)\s*(?:;|$)/i;

const normalizeCssFamily = (raw) => {
  if (!raw) return null;
  // Take the first family in a comma-separated fallback list.
  const first = raw.split(',')[0].trim();
  // Strip surrounding quotes.
  const unquoted = first.replace(/^['"]|['"]$/g, '').trim();
  if (!unquoted) return null;
  // Normalize: lowercase, spaces → hyphens.
  const normalized = unquoted.toLowerCase().replace(/\s+/g, '-');
  const tagName = `font${normalized}`;
  if (FONT_NAMES.has(tagName)) return tagName;
  // Generic family keywords map to the closest available font.
  if (normalized === 'monospace') return FONT_NAMES.has('fontmonospace') ? 'fontmonospace' : null;
  return null;
};

const collectContentPreOrig = fontFamily.collectContentPre;
exports.collectContentPre = (hookName, context, cb) => {
  collectContentPreOrig(hookName, context, () => {});
  // ep_font_family's getLineHTMLForExport rewrites `<fontarial>` into
  // `<span style="font-family:arial">` -- the standard CSS form. The
  // tagAttribute factory only reads the original tag names, so any
  // round-trip through HTML/DOCX would silently lose the font.
  // Read the CSS form too and apply the matching tag attribute.
  if (context.styl) {
    const m = STYLE_FONT_FAMILY_RE.exec(context.styl);
    if (m) {
      const tag = normalizeCssFamily(m[1]);
      if (tag) context.cc.doAttrib(context.state, tag);
    }
  }
  if (cb) return cb();
};
exports.collectContentPost = fontFamily.collectContentPost;
