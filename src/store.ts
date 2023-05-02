import { createStore, atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { assertExists, Workspace } from '@blocksuite/store'
// @ts-expect-error
import { createIndexedDBProvider } from '@toeverything/y-indexeddb'
import { AffineSchemas } from '@blocksuite/blocks/models'
import type { EditorContainer } from '@blocksuite/editor'
import { useSyncExternalStore } from 'react'
import type { PageMeta } from '@blocksuite/store'
import { initPage, WorkspaceNotFoundError } from './utils.ts'

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
export const currentPageIdAtom = atom<string | null>(null)

const hashMap = new Map<string, Workspace>()

const ref = {
  value: [] as PageMeta[],
  callback: new Set<() => void>(),
  subscribe: (onStoreChange: () => void) => {
    ref.callback.add(onStoreChange)
    return () => {
      ref.callback.delete(onStoreChange)
    }
  },
  getSnapshot: () => ref.value
}

export const useCurrentPageList = () => {
  return useSyncExternalStore(
    ref.subscribe,
    ref.getSnapshot
  )
}

export const currentWorkspaceAtom = atom<Promise<Workspace | null>>(
  async (get, {
    signal
  }) => {
    const ids = get(workspaceIdsAtom)
    const id = get(currentWorkspaceIdAtom)
    if (!id) return null
    if (ids.indexOf(id) === -1) {
      throw new WorkspaceNotFoundError('workspace not found')
    }
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

        initPage(page)
      } else {
        const page = workspace.getPage('page0')
        assertExists(page)
      }
    })
    ref.value = workspace.meta.pageMetas
    ref.callback.forEach(cb => cb())
    const dispose = workspace.slots.pageAdded.on(() => {
      assertExists(workspace)
      ref.value = workspace.meta.pageMetas
      ref.callback.forEach(cb => cb())
    })
    signal.addEventListener('abort', () => {
      provider.disconnect()
      dispose.dispose()
    })
    await provider.whenSynced
    return workspace
  })

export const editorAtom = atom<Promise<EditorContainer | null>>(async (get) => {
  const workspace = await get(currentWorkspaceAtom)
  const pageId = get(currentPageIdAtom)
  if (!workspace || !pageId) return null
  const EditorContainer = await get(editorContainerAtom)
  const editor = new EditorContainer()
  const page = workspace.getPage(pageId)
  if (!page) {
    return null
  }
  editor.page = page
  return editor
})

if (typeof window !== 'undefined') {
  const workspaceId = window.location.pathname.split('/')[1]
  const pageId = window.location.pathname.split('/')[2]
  if (workspaceId) {
    rootStore.set(currentWorkspaceIdAtom, workspaceId)
  }
  if (pageId) {
    rootStore.set(currentPageIdAtom, pageId)
  }
}
