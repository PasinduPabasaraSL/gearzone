import { useCallback, useEffect, useEffectEvent, useState } from 'react'

/**
 * Runs an async loader whenever `deps` change and tracks its lifecycle.
 *
 * Previous data is kept while a new request is in flight, so a filter change
 * dims the current grid instead of flashing skeletons. `isInitialLoading` is
 * true only when there is nothing to show yet.
 */
export function useAsync(loader, deps) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({ key: null, data: undefined, error: null })

  const key = JSON.stringify([deps, attempt])
  const runLoader = useEffectEvent(loader)

  useEffect(() => {
    let cancelled = false
    Promise.resolve()
      .then(() => runLoader())
      .then(
        (data) => {
          if (!cancelled) setState({ key, data, error: null })
        },
        (error) => {
          if (!cancelled) setState((previous) => ({ key, data: previous.data, error }))
        },
      )
    return () => {
      cancelled = true
    }
  }, [key])

  const reload = useCallback(() => setAttempt((count) => count + 1), [])
  const isLoading = state.key !== key

  return {
    data: state.data,
    error: isLoading ? null : state.error,
    isLoading,
    isInitialLoading: isLoading && state.data === undefined,
    reload,
  }
}
