import {expect, test} from '@playwright/test';
import {
  clearPadContent,
  getPadBody,
  goToNewPad,
  selectAllText,
  writeToPad,
} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

// niceSelect.js wraps each <select> with an immediately-following
// <div class="nice-select"> sibling and hides the real <select>, so the
// font is picked the way a user picks it: open the wrapper, click the
// option.
const pickFont = async (page: any, font: string) => {
  await page.locator('select.family-selection + .nice-select').first().click();
  await page.locator('.nice-select.open').locator(`[data-value=${font}]`).click();
};

test.describe('ep_font_family', () => {
  test.beforeEach(async ({page}) => {
    await goToNewPad(page);
    await clearPadContent(page);
  });

  test('applies only the selected font, not every font (#73)', async ({page}) => {
    const padBody = await getPadBody(page);
    await writeToPad(page, 'styled text');
    await selectAllText(page);
    await pickFont(page, 'fonttimes-new-roman');

    const line = padBody.locator('div').filter({hasText: 'styled text'}).last();
    await expect(line.locator('fonttimes-new-roman')).toHaveText('styled text');

    // Every other font must be absent: clearing a font has to remove the
    // attribute, not set it to the string "false" (which core reads as
    // "set" and renders as yet another font tag).
    const html = await line.innerHTML();
    const tags = [...html.matchAll(/<(font[a-z-]+)[ >]/g)].map((m) => m[1]);
    expect(tags).toEqual(['fonttimes-new-roman']);
    const classes = (await line.locator('span').first().getAttribute('class') || '')
        .split(/\s+/).filter((c) => c.startsWith('font'));
    expect(classes).toEqual(['fonttimes-new-roman']);
  });

  test('switching font replaces the previous one', async ({page}) => {
    const padBody = await getPadBody(page);
    await writeToPad(page, 'styled text');
    await selectAllText(page);
    await pickFont(page, 'fontarial');
    await expect(padBody.locator('fontarial')).toHaveText('styled text');

    await selectAllText(page);
    await pickFont(page, 'fontmonospace');
    await expect(padBody.locator('fontmonospace')).toHaveText('styled text');
    await expect(padBody.locator('fontarial')).toHaveCount(0);
  });
});
