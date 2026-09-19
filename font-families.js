'use strict';

// CSS font stacks for each toolbar font, keyed by the attribute/tag name
// used in the pad. These mirror static/css/fonts.css (what the editor
// shows) so that an exported document asks for the same typeface the
// author saw.
//
// The first family in each stack is the canonical name and must
// normalize back to its key (lower-case, spaces -> hyphens, prefixed
// with "font"), because that is how static/js/shared.js maps an
// imported `style="font-family:..."` back onto the attribute.
module.exports = {
  fontarial: 'Arial, Helvetica, sans-serif',
  'fontavant-garde':
    "'Avant Garde', Avantgarde, 'Century Gothic', CenturyGothic, AppleGothic, sans-serif",
  fontbookman: "Bookman, 'Bookman Old Style', serif",
  fontcalibri: "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif",
  fontcourier: "Courier, 'Courier New', monospace",
  fontgaramond:
    "Garamond, Baskerville, 'Baskerville Old Face', 'Hoefler Text', 'Times New Roman', serif",
  fonthelvetica: 'Helvetica, Arial, sans-serif',
  fontmonospace: 'monospace',
  fontpalatino: "Palatino, 'Palatino Linotype', 'Book Antiqua', serif",
  'fonttimes-new-roman': "'Times New Roman', Times, serif",
};
