import { useRef} from 'react'
import { useAtomValue } from 'jotai/index'
import { editorAtom } from '../store.ts'

export const Editor = () => {
  const ref = useRef<HTMLDivElement>(null)
  const editor = useAtomValue(editorAtom)
  if (ref.current && ref.current.childNodes.length === 0 && editor) {
    ref.current.appendChild(editor)
  }
  return (
    <div ref={ref} id="editor-container"/>
  )
}
