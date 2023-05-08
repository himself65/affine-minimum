import { useRef } from 'react'
import { useAtomValue } from 'jotai'
import { WorkspaceMolecule } from '../store.ts'
import { useMolecule } from 'jotai-molecules'

export const Editor = () => {
  const { currentPageIdAtom, editorAtom } = useMolecule(WorkspaceMolecule)
  const ref = useRef<HTMLDivElement>(null)
  const pageId = useAtomValue(currentPageIdAtom)
  const editor = useAtomValue(editorAtom)
  if (ref.current && ref.current.childNodes.length === 0 && editor) {
    ref.current.appendChild(editor)
  }
  if (!pageId) {
    return (
      <div>
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    )
  }
  return (
    <div ref={ref} id="editor-container"/>
  )
}
