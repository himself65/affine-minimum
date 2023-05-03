import 'fake-indexeddb/auto'

import { describe, expect, test } from 'vitest'
import {
  WorkspaceMolecule,
  rootStore,
} from '../store'
import { useMolecule } from 'jotai-molecules'
import { assertExists } from '@blocksuite/store'
import { renderHook } from '@testing-library/react'

function getAtoms() {
  return renderHook(() => useMolecule(WorkspaceMolecule)).result.current
}

describe('store', () => {
  test('init', async () => {
    const { currentWorkspaceIdAtom, currentWorkspaceAtom, workspaceIdsAtom } = getAtoms()
    expect(rootStore.get(currentWorkspaceIdAtom)).toBe(null)
    expect(await rootStore.get(currentWorkspaceAtom)).toBe(null)

    rootStore.set(workspaceIdsAtom, ['workspace0'])
    rootStore.set(currentWorkspaceIdAtom, 'workspace0')
    const workspace = await rootStore.get(currentWorkspaceAtom)
    assertExists(workspace)
    expect(workspace).not.toBe(null)
    expect(workspace.id).toBe('workspace0')
  })

  test('switch workspace', async () => {
    const { currentWorkspaceIdAtom, currentWorkspaceAtom, workspaceIdsAtom } = getAtoms()
    rootStore.set(workspaceIdsAtom, ['workspace1', 'workspace2'])
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
