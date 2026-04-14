'use strict';

const {tagAttribute} = require('ep_plugin_helpers/attributes');
const fonts = require('../../fonts');

const fontFamily = tagAttribute({tags: fonts});

exports.collectContentPre = fontFamily.collectContentPre;
exports.collectContentPost = fontFamily.collectContentPost;
