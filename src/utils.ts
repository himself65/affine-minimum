import type { Page } from '@blocksuite/store'

export class WorkspaceNotFoundError extends Error {}

export async function initPage(page: Page) {
  await page.waitForLoaded();
  const pageBlockId = page.addBlock('affine:page', {
    title: new page.Text(''),
  });
  page.addBlock('affine:surface', {}, pageBlockId);
  const noteBlockId = page.addBlock('affine:note', {}, pageBlockId);
  page.addBlock('affine:paragraph', {}, noteBlockId);
  page.resetHistory()
}
