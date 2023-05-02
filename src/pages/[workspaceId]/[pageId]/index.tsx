import {
  currentPageIdAtom, currentWorkspaceAtom,
  currentWorkspaceIdAtom,
  rootStore
} from '../../../store.ts'
import { useAtomValue } from 'jotai'
import { Suspense, useEffect, useState } from 'react'

import Link from 'next/link'
import { Editor } from '../../../components/Editor'
import { buttonStyle, containerStyle } from '../../../styles/index.css.ts'
import { PageList } from '../../../components/page-list'
import { assertExists } from '@blocksuite/store'
import { initPage } from '../../../utils.ts'

const WorkspacePage = () => {
  const workspaceId = useAtomValue(currentWorkspaceIdAtom)
  const pageId = useAtomValue(currentPageIdAtom)
  const [value, setValue] = useState<boolean | undefined>(undefined)
  const isInitialRender = value === undefined
  useEffect(() => {
    setValue(true)
  }, [])
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
            initPage(page)
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
    </div>
  )
}

export default WorkspacePage
