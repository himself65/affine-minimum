import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useState
} from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  currentWorkspaceIdAtom,
  workspaceIdsAtom
} from '../store.ts'
import { useRouter } from 'next/router'

const SelectWorkspace = () => {
  const ids = useAtomValue(workspaceIdsAtom)
  const router = useRouter()
  const setId = useSetAtom(currentWorkspaceIdAtom)
  return (
    <div>
      <select
        onChange={useCallback((e: ChangeEvent<HTMLSelectElement>) => {
          setId(e.target.value)
          void router.push(`/${e.target.value}`)
        }, [router, setId])}
      >
        {ids.map((id) => (
          <option key={id} value={id}>{id}</option>
        ))}
      </select>
    </div>
  )
}

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
    <div>
      <SelectWorkspace/>
    </div>
  )
}

export default Index
