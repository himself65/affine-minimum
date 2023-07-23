import {
  WorkspaceMolecule,
  rootStore, WorkspaceScope
} from '../../../store.ts'
import { useAtomValue } from 'jotai'
import { Suspense, useEffect, useMemo, useState } from 'react'

import Link from 'next/link'
import { Editor } from '../../../components/Editor'
import { buttonStyle, containerStyle } from '../../../styles/index.css.ts'
import { PageList } from '../../../components/page-list'
import { assertExists } from '@blocksuite/store'
import { initPage } from '../../../utils.ts'
import { ScopeProvider, useMolecule } from 'jotai-molecules'

const WorkspacePage = () => {
  const { currentPageIdAtom, currentWorkspaceAtom, currentWorkspaceIdAtom } = useMolecule(WorkspaceMolecule)
  const workspaceId = useAtomValue(currentWorkspaceIdAtom)
  const pageId = useAtomValue(currentPageIdAtom)
  const [value, setValue] = useState<boolean | undefined>(undefined)
  const isInitialRender = value === undefined
  useEffect(() => {
    setValue(true)
  }, [])
  const scopeValue = useMemo(() => ({
    defaultPage: pageId,
    defaultWorkspace: workspaceId,
    defaultMode: 'page'
  }) as const, [pageId, workspaceId])
  if (isInitialRender) {
    return 'Loading...'
  }
  return (
    <div className={containerStyle}>
      <Link href='/'>
        Back to root
      </Link>
      <div>
        {workspaceId && <PageList/>}
        <button
          className={buttonStyle}
          onClick={async () => {
            const workspace = await rootStore.get(currentWorkspaceAtom)
            assertExists(workspace)
            const page = workspace.createPage({
              id: `page${workspace.meta.pageMetas.length}`
            })
            await initPage(page)
          }}
        >
          add page
        </button>
      </div>
      <Suspense fallback={
        <div>Loading...</div>
      }>
        <Editor
          key={`${workspaceId}-${pageId}`}
        />
      </Suspense>
      <ScopeProvider scope={WorkspaceScope} value={scopeValue}>
        <Suspense fallback={
          <div>Loading...</div>
        }>
          <Editor
            key={`${scopeValue.defaultWorkspace}-${scopeValue.defaultPage}`}
          />
        </Suspense>
      </ScopeProvider>
    </div>
  )
}

export default WorkspacePage
