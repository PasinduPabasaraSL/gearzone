import CatalogView from '../components/catalog/CatalogView'
import PageHeader from '../components/catalog/PageHeader'
import Container from '../components/common/Container'
import { usePageMeta } from '../hooks/usePageMeta'

const SCOPE = { collection: 'new' }

export default function NewArrivals() {
  usePageMeta({
    title: 'New Arrivals',
    description: 'The newest keyboards, audio, desk and charging gear to land at GearZoneLK.',
  })

  return (
    <Container className="pb-20">
      <PageHeader
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'New Arrivals' }]}
        eyebrow="Just landed"
        title="Fresh gear"
        description="The latest additions to the catalogue, newest first."
      />
      <CatalogView scope={SCOPE} defaultSort="newest" />
    </Container>
  )
}
