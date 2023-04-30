import 'fake-indexeddb/auto'

import { describe, expect, test } from 'vitest'
import {
  currentWorkspaceAtom,
  currentWorkspaceIdAtom,
  rootStore
} from '../store'
import { assertExists } from '@blocksuite/store'

describe('store', () => {
  test('init', async () => {
    expect(rootStore.get(currentWorkspaceIdAtom)).toBe(null)
    expect(await rootStore.get(currentWorkspaceAtom)).toBe(null)

    rootStore.set(currentWorkspaceIdAtom, 'workspace0')
    const workspace = await rootStore.get(currentWorkspaceAtom)
    assertExists(workspace)
    expect(workspace).not.toBe(null)
    expect(workspace.id).toBe('workspace0')
  })

  test('switch workspace', async () => {
    rootStore.set(currentWorkspaceIdAtom, 'workspace1')
    {
      const workspace = await rootStore.get(currentWorkspaceAtom)
      assertExists(workspace)
      expect(workspace).not.toBe(null)
      expect(workspace.id).toBe('workspace1')
      workspace.setPageMeta('page0', {
        title: 'test0'
      })
    }

    rootStore.set(currentWorkspaceIdAtom, 'workspace2')
    {
      const workspace = await rootStore.get(currentWorkspaceAtom)
      assertExists(workspace)
      expect(workspace).not.toBe(null)
      expect(workspace.id).toBe('workspace2')
    }

    rootStore.set(currentWorkspaceIdAtom, 'workspace1')
    {
      const workspace = await rootStore.get(currentWorkspaceAtom)
      assertExists(workspace)
      expect(workspace).not.toBe(null)
      expect(workspace.id).toBe('workspace1')
      const pageMeta = workspace.meta.getPageMeta('page0')
      assertExists(pageMeta)
      expect(pageMeta.title).toBe('test0')
    }
  })
})
