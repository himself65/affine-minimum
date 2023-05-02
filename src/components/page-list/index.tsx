import { useAtomValue, useSetAtom } from 'jotai'
import {
  currentPageIdAtom,
  currentPageMetaAtom,
} from '../../store.ts'
import { ReactElement } from 'react'

export const PageList = (): ReactElement => {
  const pageList= useAtomValue(currentPageMetaAtom)
  const setPageId= useSetAtom(currentPageIdAtom)
  return (
    <div>
      {pageList.map((pageMeta) => (
        <div key={pageMeta.id}
          onClick={() => {
            setPageId(pageMeta.id)
          }}
        >
          {pageMeta.id}
        </div>
      ))}
    </div>
  )
}
