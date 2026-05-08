'use strict';

import {init, generateJWTToken} from 'ep_etherpad-lite/tests/backend/common';
import {randomString} from 'ep_etherpad-lite/static/js/pad_utils';

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
    ['arial', 'Arial'],
    ['times-new-roman', "'Times New Roman'"],
    ['courier', 'courier'],
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
      // Re-export should contain a `font-family:<tag-without-font>` style
      // (or the explicit tag form, depending on what
      // getLineHTMLForExport produces).
      const tagInner = tag;
      const re = new RegExp(`font-family:${tagInner}|<font${tagInner}\\b`, 'i');
      if (!re.test(out)) {
        throw new Error(
            `Font ${tag} not preserved on style-import round-trip. Got: ${out}`);
      }
    });
  }
});
