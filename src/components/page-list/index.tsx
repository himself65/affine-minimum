import { useAtomValue, useSetAtom } from 'jotai'
import { WorkspaceMolecule } from '../../store.ts'
import { ReactElement } from 'react'
import { useMolecule } from 'jotai-molecules'

export const PageList = (): ReactElement => {
  const { currentPageIdAtom,currentPageMetaAtom } = useMolecule(WorkspaceMolecule)
  const pageList = useAtomValue(currentPageMetaAtom)
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
