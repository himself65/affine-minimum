import { useAtomValue, useSetAtom } from 'jotai'
import {
  currentPageIdAtom,
  currentWorkspaceIdAtom,
  workspaceIdsAtom
} from '../../store.ts'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { cardStyle, containerStyle } from './index.css.ts'

export const WorkspaceList = () => {
  const ids = useAtomValue(workspaceIdsAtom)
  const router = useRouter()
  const setIds = useSetAtom(workspaceIdsAtom)
  const setWorkspaceId = useSetAtom(currentWorkspaceIdAtom)
  const setPageId = useSetAtom(currentPageIdAtom)
  return (
    <div className={containerStyle}>
      {ids.map((id) => (
        <div className={cardStyle} key={id}>
          <button
            onClick={(e) => {
              e.preventDefault()
              setIds((ids) => ids.filter((i) => i !== id))
            }}
          >
            delete
          </button>
          <button
            onClick={() => {
              setWorkspaceId(id)
              setPageId('page0')
              void router.push(`/${id}/page0`)
            }}
          >
            open
          </button>
          <span>{id}</span>
        </div>
      ))}
      <div className={cardStyle}
        onClick={useCallback(() => {
          const id = prompt('Workspace ID')
          if (id) {
            setIds((ids) => {
              if (ids.includes(id)) {
                return ids
              }
              return [...ids, id]
            })
          }
        }, [setIds])}
      >
        ADD Workspace
      </div>
    </div>
  )
}
