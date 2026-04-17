'use strict';

const {tagAttribute} = require('ep_plugin_helpers/attributes');
const fonts = require('../../fonts');

const fontFamily = tagAttribute({tags: fonts});

exports.aceAttribsToClasses = fontFamily.aceAttribsToClasses;
exports.aceRegisterBlockElements = fontFamily.aceRegisterBlockElements;
exports.aceAttribClasses = fontFamily.aceAttribClasses;

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
        ace.ace_setAttributeOnSelection(f, false);
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
      if (call.editorInfo.ace_getAttributeOnSelection(font)) {
        select.val(font);
        break;
      }
    }
    select.niceSelect('update');
  }, 250);
};

exports.aceEditorCSS = () => ['/ep_font_family/static/css/fonts.css'];
