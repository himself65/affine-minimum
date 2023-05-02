import type { Page } from '@blocksuite/store'

export class WorkspaceNotFoundError extends Error {}

export function initPage(page: Page) {
  const pageBlockId = page.addBlock('affine:page', {
    title: new Text()
  })

  page.addBlock('affine:surface', {}, null)

  // Add frame block inside page block
  const frameId = page.addBlock('affine:frame', {}, pageBlockId)
  // Add paragraph block inside frame block
  page.addBlock('affine:paragraph', {}, frameId)
  page.resetHistory()
}
