import BenefitsStrip from '../components/home/BenefitsStrip'
import BrandSection from '../components/home/BrandSection'
import CategoryShowcase from '../components/home/CategoryShowcase'
import CollectionSection from '../components/home/CollectionSection'
import DealsSection from '../components/home/DealsSection'
import DeskSetupSection from '../components/home/DeskSetupSection'
import Hero from '../components/home/Hero'
import Newsletter from '../components/home/Newsletter'
import WhyGearZone from '../components/home/WhyGearZone'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Home() {
  usePageMeta({})

  return (
    <>
      <Hero />
      <BenefitsStrip />
      <CategoryShowcase />
      <CollectionSection
        id="featured"
        eyebrow="Featured"
        title="Featured gear"
        description="Our most-loved upgrades, chosen for quality and everyday value."
        collection="featured"
        limit={10}
        gridClassName="max-2xl:[&>*:nth-child(n+9)]:hidden"
        actionTo="/shop"
        className="pt-0 sm:pt-0"
      />
      <DealsSection />
      <CollectionSection
        id="trending"
        eyebrow="Trending"
        title="Trending now"
        description="What people across Sri Lanka are adding to their desks this week."
        collection="trending"
        limit={10}
        display="carousel"
        actionTo="/shop?sort=rating"
      />
      <DeskSetupSection />
      <CollectionSection
        id="new-arrivals"
        eyebrow="Just landed"
        title="Fresh gear"
        description="The newest additions to the GearZoneLK catalogue."
        collection="new"
        limit={5}
        actionTo="/new-arrivals"
        gridClassName="max-md:[&>*:nth-child(n+3)]:hidden max-2xl:[&>*:nth-child(5)]:hidden"
      />
      <BrandSection />
      <WhyGearZone />
      <Newsletter />
    </>
  )
}
