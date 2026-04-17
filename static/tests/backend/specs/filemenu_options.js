'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const ejs = require('ep_etherpad-lite/node_modules/ejs');
const fonts = require('../../../..' + '/fonts');

const fileMenuTmpl = path.resolve(
    __dirname, '..', '..', '..', '..', 'templates', 'fileMenu.ejs');
const editbarTmpl = path.resolve(
    __dirname, '..', '..', '..', '..', 'templates', 'editbarButtons.ejs');

const render = (p) => ejs.render(fs.readFileSync(p, 'utf8'), {fonts});

describe(__filename, function () {
  it('fileMenu.ejs renders an <option> per font (#28)', function () {
    const html = render(fileMenuTmpl);
    for (const font of fonts) {
      assert(html.includes(`value="${font}"`),
          `file menu template should render an option for font ${font}; got:\n${html}`);
    }
  });

  it('editbarButtons.ejs renders an <option> per font (#28)', function () {
    const html = render(editbarTmpl);
    for (const font of fonts) {
      assert(html.includes(`value="${font}"`),
          `editbar template should render an option for font ${font}; got:\n${html}`);
    }
  });
});
