import { useRef} from 'react'
import { useAtomValue } from 'jotai'
import { currentPageIdAtom, editorAtom } from '../store.ts'

export const Editor = () => {
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
