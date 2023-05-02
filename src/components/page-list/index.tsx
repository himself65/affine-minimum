import { useSetAtom } from 'jotai'
import { currentPageIdAtom, useCurrentPageList } from '../../store.ts'
import { ReactElement } from 'react'

export const PageList = (): ReactElement => {
  const pageList= useCurrentPageList()
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
