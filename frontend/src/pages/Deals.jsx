import CatalogView from '../components/catalog/CatalogView'
import PageHeader from '../components/catalog/PageHeader'
import Container from '../components/common/Container'
import { usePageMeta } from '../hooks/usePageMeta'

const SCOPE = { collection: 'deals' }

export default function Deals() {
  usePageMeta({
    title: 'Gear Deals',
    description: 'Limited-time discounts on keyboards, audio, chargers and desk accessories, delivered islandwide.',
  })

  return (
    <Container className="pb-20">
      <PageHeader
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Deals' }]}
        eyebrow="Gear Deals"
        title="Upgrade for less."
        description="Our deepest in-stock discounts. Prices hold while stock lasts — no countdown timers, no tricks."
      />
      <CatalogView scope={SCOPE} defaultSort="discount" emptyTitle="No deals right now" emptyDescription="Check back soon — new deals land every week." />
    </Container>
  )
}
