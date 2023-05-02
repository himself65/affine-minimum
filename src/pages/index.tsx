import React, {
  useEffect,
  useState
} from 'react'
import { WorkspaceList } from '../components/workspace-list'

function Index () {
  const [value, setValue] = useState<boolean | undefined>(undefined)
  const isInitialRender = value === undefined
  useEffect(() => {
    setValue(true)
  }, [])
  if (isInitialRender) {
    return 'Loading...'
  }
  return (
    <main>
      <WorkspaceList/>
    </main>
  )
}

export default Index
