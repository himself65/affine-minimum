import { createStore, atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { assertExists, Workspace } from '@blocksuite/store'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { createIndexedDBProvider } from '@toeverything/y-indexeddb'
import { AffineSchemas } from '@blocksuite/blocks/models'
import type { EditorContainer } from '@blocksuite/editor'

const editorContainerAtom = atom<Promise<typeof EditorContainer>>(async () => {
  const { EditorContainer } = await import('@blocksuite/editor')
  return EditorContainer
})

export const rootStore = createStore()

export const workspaceIdsAtom = atomWithStorage<string[]>('workspaces', [])

workspaceIdsAtom.onMount = (set) => {
  if (localStorage.getItem('workspaces') === null) {
    set([
      'demo-workspace'
    ])
  }
}

export const currentWorkspaceIdAtom = atom<string | null>(null)

const hashMap = new Map<string, Workspace>()

export const currentWorkspaceAtom = atom<Promise<Workspace | null>>(
  async (get, {
    signal
  }) => {
    const id = get(currentWorkspaceIdAtom)
    if (!id) return null
    let workspace = hashMap.get(id)
    if (!workspace) {
      workspace = new Workspace({
        id
      })
      workspace.register(AffineSchemas)
      hashMap.set(id, workspace)
    }
    const provider = createIndexedDBProvider(workspace.id, workspace.doc)
    assertExists(provider)
    provider.connect()
    provider.whenSynced.then(() => {
      assertExists(workspace)
      if (workspace.isEmpty) {
        const page = workspace.createPage({
          id: 'page0'
        })

        const pageBlockId = page.addBlock('affine:page', {
          title: new Text()
        })

        page.addBlock('affine:surface', {}, null)

        // Add frame block inside page block
        const frameId = page.addBlock('affine:frame', {}, pageBlockId)
        // Add paragraph block inside frame block
        page.addBlock('affine:paragraph', {}, frameId)
        page.resetHistory()
      } else {
        const page = workspace.getPage('page0')
        assertExists(page)
      }
    })
    signal.addEventListener('abort', () => {
      provider.disconnect()
    })
    await provider.whenSynced
    return workspace
  })

export const editorAtom = atom<Promise<EditorContainer | null>>(async (get) => {
  const workspace = await get(currentWorkspaceAtom)
  if (!workspace) return null
  const EditorContainer = await get(editorContainerAtom)
  const editor = new EditorContainer()
  const page = workspace.getPage('page0')
  assertExists(page)
  editor.page = page
  return editor
})

if (typeof window !== 'undefined') {
  const id = window.location.pathname.split('/')[1]
  if (id) {
    rootStore.set(currentWorkspaceIdAtom, id)
    const items = localStorage.getItem('workspaces')
    if (!items || JSON.parse(items).indexOf(id) === -1) {
      localStorage.setItem('workspaces', JSON.stringify([
        ...JSON.parse(items || '[]'),
        id
      ]))
    }
  }
}
