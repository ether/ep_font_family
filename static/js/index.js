'use strict';

const {tagAttribute} = require('ep_plugin_helpers/attributes');
const fonts = require('../../fonts');

const fontFamily = tagAttribute({tags: fonts});

exports.aceRegisterBlockElements = fontFamily.aceRegisterBlockElements;

// Deliberately not `fontFamily.aceAttribClasses`: core's linestylefilter
// looks a set attribute up in ATTRIB_CLASSES by name only and never
// looks at its value, so a font whose value is the *string* "false"
// (what pads written by ep_font_family <= 0.5.98 stored for the fonts
// that were cleared, see #73) still got its class and its `<font...>`
// tag. Mapping the attribute here instead lets us ignore those stale
// values, so old pads render with the single font they were given.
exports.aceAttribsToClasses = (hook, context) => {
  if (!fonts.includes(context.key)) return;
  if (!context.value || context.value === 'false') return [];
  // `tag:x` makes core's domline emit `<x>` around the text as well as
  // adding the `x` class, which is what the editor CSS styles.
  return [`tag:${context.key}`];
};

exports.postAceInit = (hook, context) => {
  // Font options are rendered server-side by the editbarButtons.ejs and
  // fileMenu.ejs templates (from ./fonts.js). Previously this hook
  // appended them after Etherpad had already wrapped the <select> in
  // niceSelect, so the File menu dropdown showed only the placeholder
  // (#28). We just bind the change handler here.
  const select = $('select.family-selection');
  select.on('change', function () {
    const value = $(this).val();
    context.ace.callWithAce((ace) => {
      for (const f of fonts) {
        // '' removes the attribute. Passing `false` used to write the
        // *string* "false" into the attribute pool (core stringifies
        // attribute values), and core treats any non-empty value as
        // set -- so every font ended up applied at once (#73).
        ace.ace_setAttributeOnSelection(f, '');
      }
      ace.ace_setAttributeOnSelection(value, true);
    }, 'insertfontFamily', true);
    context.ace.focus();
  });
};

exports.aceEditEvent = (hook, call) => {
  const cs = call.callstack;
  if (!(cs.type === 'handleClick') && !(cs.type === 'handleKeyEvent') && !(cs.docTextChanged)) {
    return false;
  }
  if (cs.type === 'setBaseText' || cs.type === 'setup') return false;

  setTimeout(() => {
    const select = $('.family-selection');
    select.val('dummy');

    if (call.rep.selStart[1] === 0) return;
    if (call.rep.selStart[1] === 1 && call.rep.alltext[0] === '*') return;

    for (const font of fonts) {
      const value = call.editorInfo.ace_getAttributeOnSelection(font);
      // "false" is a stale value written by ep_font_family <= 0.5.98, see #73.
      if (value && value !== 'false') {
        select.val(font);
        break;
      }
    }
    select.niceSelect('update');
  }, 250);
};

exports.aceEditorCSS = () => ['/ep_font_family/static/css/fonts.css'];
