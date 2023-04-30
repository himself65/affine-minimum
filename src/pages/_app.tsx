import '@blocksuite/editor/themes/affine.css'
import '../index.css'

import type { AppProps } from 'next/app'
import { Provider } from 'jotai'
import { rootStore } from '../store.ts'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={rootStore}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default App
