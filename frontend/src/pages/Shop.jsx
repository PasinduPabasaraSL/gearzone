import CatalogView from '../components/catalog/CatalogView'
import PageHeader from '../components/catalog/PageHeader'
import Container from '../components/common/Container'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Shop() {
  usePageMeta({
    title: 'Shop All Gear',
    description: 'Browse keyboards, mice, desk mats, cables, chargers, hubs, audio and phone accessories at GearZoneLK.',
  })

  return (
    <Container className="pb-20">
      <PageHeader
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Shop' }]}
        title="Shop all gear"
        description="Every keyboard, cable, stand and accessory in the GearZoneLK catalogue — filter to find exactly what your setup needs."
      />
      <CatalogView />
    </Container>
  )
}
