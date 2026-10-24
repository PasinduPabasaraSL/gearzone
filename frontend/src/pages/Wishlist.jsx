import { Heart, ShoppingBag } from 'lucide-react'
import PageHeader from '../components/catalog/PageHeader'
import Button from '../components/common/Button'
import Container from '../components/common/Container'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import ProductGrid from '../components/product/ProductGrid'
import { useAsync } from '../hooks/useAsync'
import { useCart, useToast, useWishlist } from '../hooks/useContexts'
import { usePageMeta } from '../hooks/usePageMeta'
import { getProductsByIds } from '../services/catalog'

export default function Wishlist() {
  const { ids, clear } = useWishlist()
  const { addItem, openCart } = useCart()
  const { toast } = useToast()
  const { data: products, isInitialLoading, error, reload } = useAsync(() => getProductsByIds(ids), [ids])
  usePageMeta({ title: 'Your Wishlist' })

  // Keep the grid in sync immediately when items are removed from it.
  const visible = (products ?? []).filter((product) => ids.includes(product.id))
  const inStock = visible.filter((product) => product.stock > 0)

  const addAllToCart = () => {
    inStock.forEach((product) => addItem(product, 1))
    toast({
      title: `Added ${inStock.length} item${inStock.length === 1 ? '' : 's'} to cart`,
      action: { label: 'View cart', onClick: openCart },
    })
  }

  return (
    <Container className="pb-20">
      <PageHeader
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]}
        title="Your wishlist"
        description={ids.length > 0 ? `${ids.length} saved item${ids.length === 1 ? '' : 's'}.` : undefined}
        aside={
          visible.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
              <Button variant="quiet" onClick={clear}>
                Clear wishlist
              </Button>
              <Button onClick={addAllToCart} disabled={inStock.length === 0}>
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Add all to cart
              </Button>
            </div>
          )
        }
      />

      {error ? (
        <ErrorState onRetry={reload} />
      ) : ids.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty."
          description="Tap the heart on any product to save it here for later."
          actionLabel="Discover Gear"
          actionTo="/shop"
        />
      ) : (
        <ProductGrid products={visible} isLoading={isInitialLoading} skeletonCount={Math.min(ids.length, 8)} />
      )}
    </Container>
  )
}
