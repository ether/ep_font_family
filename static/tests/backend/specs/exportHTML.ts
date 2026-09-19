'use strict';

import {init, generateJWTToken} from 'ep_etherpad-lite/tests/backend/common';
import {randomString} from 'ep_etherpad-lite/static/js/pad_utils';
import fs from 'fs';
import path from 'path';
import fonts from '../../../../fonts';
import families from '../../../../font-families';

let agent: any;
const apiVersion = 1;

const createPad = async (padID: string): Promise<string> => {
  const res = await agent.get(`/api/${apiVersion}/createPad?padID=${padID}`)
      .set('Authorization', await generateJWTToken());
  if (res.body.code !== 0) throw new Error('Unable to create new Pad');
  return padID;
};

const setHTML = async (padID: string, html: string): Promise<string> => {
  const res = await agent.get(
      `/api/${apiVersion}/setHTML?padID=${padID}&html=${encodeURIComponent(html)}`)
      .set('Authorization', await generateJWTToken());
  if (res.body.code !== 0) throw new Error('Unable to set pad HTML');
  return padID;
};

const getHTMLEndPointFor = (padID: string) =>
  `/api/${apiVersion}/getHTML?padID=${padID}`;

const buildHTML = (body: string) => `<html><body>${body}</body></html>`;

describe('ep_font_family — round-trip via inline style="font-family"', function () {
  // External HTML (Word/DOCX via mammoth, pasted markup) uses the
  // standard CSS form, not the tag form ep_font_family reads on import.
  // Without the import-side style reader, font is dropped.
  before(async function () { agent = await init(); });

  const cases: Array<[string, string]> = [
    ['fontarial', 'Arial'],
    ['fonttimes-new-roman', "'Times New Roman'"],
    ['fontcourier', 'courier'],
  ];

  for (const [tag, cssValue] of cases) {
    it(`preserves font-family:${cssValue} through round-trip`, async function () {
      const padID = randomString(5);
      await createPad(padID);
      await setHTML(padID,
          buildHTML(`<p>before <span style="font-family:${cssValue}">styled</span> after</p>`));
      const res = await agent.get(getHTMLEndPointFor(padID))
          .set('Authorization', await generateJWTToken());
      const out: string = res.body.data.html;
      // Re-export uses the plugin's canonical CSS stack for that font.
      if (!out.includes(`font-family:${families[tag]}`)) {
        throw new Error(
            `Font ${tag} not preserved on style-import round-trip. Got: ${out}`);
      }
    });
  }
});

describe('ep_font_family — exported HTML names a real typeface', function () {
  // The exported style is what Word / LibreOffice / a browser reads when
  // the pad is converted to .doc/.odt/.pdf. `font-family:times-new-roman`
  // is not a font that exists anywhere, so the converter silently falls
  // back to the default face and the formatting looks lost (#27).
  before(async function () { agent = await init(); });

  for (const [tag, family] of Object.entries(families) as Array<[string, string]>) {
    it(`exports <${tag}> as font-family:${family}`, async function () {
      const padID = randomString(5);
      await createPad(padID);
      await setHTML(padID, buildHTML(`<p>before <${tag}>styled</${tag}> after</p>`));
      const res = await agent.get(getHTMLEndPointFor(padID))
          .set('Authorization', await generateJWTToken());
      const out: string = res.body.data.html;
      if (!out.includes(`<span style="font-family:${family}">styled</span>`)) {
        throw new Error(`Expected font-family:${family} in export. Got: ${out}`);
      }
      // The tag name itself is not a font name and must never be exported
      // as one. (Only meaningful for the multi-word fonts, whose tag name
      // is hyphenated: "times-new-roman" is nobody's font.)
      if (tag.includes('-') && new RegExp(`font-family:\\s*${tag.substring(4)}\\b`).test(out)) {
        throw new Error(`Export used the tag name as a font family. Got: ${out}`);
      }
    });
  }

  it('the editor CSS asks for the same stacks as the export', function () {
    // What the author sees while editing has to be what the exported
    // document asks for, otherwise "the font changed on export" (#27).
    const css = fs.readFileSync(
        path.join(__dirname, '../../../css/fonts.css'), 'utf8');
    for (const font of fonts) {
      const m = new RegExp(`${font}\\s*{\\s*font-family:\\s*([^;}]+)`).exec(css);
      if (!m) throw new Error(`No rule for ${font} in static/css/fonts.css`);
      if (m[1].trim() !== families[font]) {
        throw new Error(`static/css/fonts.css has "${m[1].trim()}" for ${font}, ` +
                        `font-families.js has "${families[font]}"`);
      }
    }
  });

  it('every font has a CSS stack whose first family maps back to it', function () {
    if (Object.keys(families).length !== fonts.length) {
      throw new Error('font-families.js and fonts.js are out of sync');
    }
    for (const font of fonts) {
      const family = families[font];
      if (!family) throw new Error(`No CSS font stack for ${font}`);
      const canonical = family.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
      const tag = `font${canonical.toLowerCase().replace(/\s+/g, '-')}`;
      if (tag !== font) {
        throw new Error(`${font} exports as "${canonical}", which imports back as ${tag}`);
      }
    }
  });
});
