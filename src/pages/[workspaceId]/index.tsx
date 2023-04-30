import { currentWorkspaceIdAtom } from '../../store.ts'
import { useAtomValue } from 'jotai'
import { Suspense, useEffect, useState } from 'react'
import { Editor } from '../../components/Editor'

const WorkspacePage = () => {
  const currentId = useAtomValue(currentWorkspaceIdAtom)
  const [value, setValue] = useState<boolean | undefined>(undefined)
  const isInitialRender = value === undefined
  useEffect(() => {
    setValue(true)
  }, [])
  if (isInitialRender) {
    return 'Loading...'
  }
  return (
    <div>
      <Suspense fallback={
        <div>Loading...</div>
      }>
        <Editor key={currentId}/>
      </Suspense>
    </div>
  )
}

export default WorkspacePage
