var _, $, jQuery;

var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var FontFamilyClass = 'FontFamily';
var cssFiles = ['ep_font_family/static/css/editor.css'];
// All our FontFamily are block elements, so we just return them.
var FontFamily = ['Arial', 'TimesNewRoman', 'Calibri', 'Helvetica', 'Courier', 'Palatino', 'Garamond', 'Bookman', 'Avant Guard'];

// Bind the event handler to the toolbar buttons
var postAceInit = function(hook, context){
  var hs = $('#font-selection');
  hs.on('change', function(){
    var value = $(this).val();
    var intValue = parseInt(value,10);
    if(!_.isNaN(intValue)){
      context.ace.callWithAce(function(ace){
        ace.ace_doInsertFontFamily(intValue);
      },'insertColor' , true);
      hs.val("dummy");
    }
  })
};



// Our FontFamily attribute will result in a heaading:h1... :h6 class
function aceAttribsToClasses(hook, context){
  if(context.key == 'FontFamily'){
    return ['FontFamily:' + context.value ];
  }
}


// Here we convert the class FontFamily:h1 into a tag
exports.aceCreateDomLine = function(name, context){
  var cls = context.cls;
  var domline = context.domline;
  var FontFamilyType = /(?:^| )FontFamily:([A-Za-z0-9]*)/.exec(cls);

  var tagIndex;
  if (FontFamilyType) tagIndex = _.indexOf(FontFamily, FontFamilyType[1]);

      
  if (tagIndex !== undefined && tagIndex >= 0){
      console.log('COLOR');
      console.log(tagIndex, FontFamilyType[1]);    
      
    var tag = FontFamily[tagIndex];
    var modifier = {
      extraOpenTags: '<span style="font-family: ' + tag + '">',
      extraCloseTags: '</span>',
      cls: cls
    };
    console.log(cls);
    return [modifier];
  }
  return [];
};



// Find out which lines are selected and assign them the FontFamily attribute.
// Passing a level >= 0 will set a FontFamily on the selected lines, level < 0 
// will remove it
function doInsertFontFamily(level){
  var rep = this.rep,
    documentAttributeManager = this.documentAttributeManager;
  if (!(rep.selStart && rep.selEnd) || (level >= 0 && FontFamily[level] === undefined))
  {
    return;
  }
  
    if(level >= 0){
          documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [
                ['FontFamily', FontFamily[level]]
          ]);
    }else{
        documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [
                    ['FontFamily', '']
              ]);
    }
}


// Once ace is initialized, we set ace_doInsertFontFamily and bind it to the context
function aceInitialized(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertFontFamily = _(doInsertFontFamily).bind(context);
}


// Export all hooks
//exports.aceRegisterBlockElements = aceRegisterBlockElements;
exports.aceInitialized = aceInitialized;
exports.postAceInit = postAceInit;
//exports.aceDomLineProcessLineAttributes = aceDomLineProcessLineAttributes;
exports.aceAttribsToClasses = aceAttribsToClasses;
//exports.aceEditorCSS = aceEditorCSS;
