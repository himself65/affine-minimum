import '@blocksuite/editor/themes/affine.css'
import '../index.css'

import type { AppProps } from 'next/app'
import { Provider } from 'jotai'
import { rootStore, WorkspaceScope } from '../store.ts'
import { ErrorBoundary } from 'react-error-boundary'
import { WorkspaceNotFoundError } from '../utils.ts'
import Link from 'next/link'
import { ScopeProvider } from 'jotai-molecules'

const defaultValue: WorkspaceScope = {
  defaultPage: null,
  defaultWorkspace: null,
  defaultMode: 'page'
}

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
        <ScopeProvider scope={WorkspaceScope} value={defaultValue}>
          <Component {...pageProps} />
        </ScopeProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
