import '@blocksuite/editor/themes/affine.css'
import '../index.css'

import type { AppProps } from 'next/app'
import { Provider } from 'jotai'
import { rootStore } from '../store.ts'
import { ErrorBoundary } from 'react-error-boundary'
import { WorkspaceNotFoundError } from '../utils.ts'
import Link from 'next/link'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ErrorBoundary
      fallbackRender={props => {
        if (props.error instanceof WorkspaceNotFoundError) {
          return (
            <div>
              <h1>Workspace not found</h1>
              <Link href='/' onClick={() => {
                props.resetErrorBoundary()
              }}>
                Go back to home
              </Link>
            </div>
          )
        } else {
          return (
            <div>
              <h1>Something went wrong.</h1>
              <pre>{props.error.message}</pre>
            </div>
          )
        }
      }}
    >
      <Provider store={rootStore}>
        <Component {...pageProps} />
      </Provider>
    </ErrorBoundary>
  )
}

export default App
