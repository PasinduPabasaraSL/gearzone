import { useRouteError } from 'react-router-dom'
import Container from '../common/Container'
import ErrorState from '../common/ErrorState'

/** Route-level error boundary: catches render errors and failed chunk loads. */
export default function RouteError() {
  const error = useRouteError()
  const chunkFailed = error instanceof TypeError && /dynamically imported module|Failed to fetch/i.test(error.message)

  return (
    <Container className="py-16">
      <ErrorState
        title="Something went wrong."
        description={
          chunkFailed
            ? 'Part of the store could not be loaded. Check your connection and try again.'
            : 'An unexpected error occurred on this page. Please try again.'
        }
        onRetry={() => window.location.reload()}
      />
    </Container>
  )
}
