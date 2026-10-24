import Layout from './components/layout/Layout'
import PageLoader from './components/layout/PageLoader'
import RouteError from './components/layout/RouteError'
import Home from './pages/Home'

/**
 * Route table. The homepage ships in the main bundle for a fast first visit;
 * every other page is code-split and fetched on navigation.
 */
const page = (load) => () => load().then((module) => ({ Component: module.default }))

export const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteError />,
    hydrateFallbackElement: <PageLoader />,
    children: [
      {
        errorElement: <RouteError />,
        children: [
          { index: true, element: <Home /> },
          { path: 'shop', lazy: page(() => import('./pages/Shop')) },
          { path: 'category/:slug', lazy: page(() => import('./pages/Category')) },
          { path: 'deals', lazy: page(() => import('./pages/Deals')) },
          { path: 'new-arrivals', lazy: page(() => import('./pages/NewArrivals')) },
          { path: 'product/:slug', lazy: page(() => import('./pages/ProductDetails')) },
          { path: 'search', lazy: page(() => import('./pages/Search')) },
          { path: 'cart', lazy: page(() => import('./pages/Cart')) },
          { path: 'wishlist', lazy: page(() => import('./pages/Wishlist')) },
          { path: 'checkout', lazy: page(() => import('./pages/Checkout')) },
          { path: 'about', lazy: page(() => import('./pages/About')) },
          { path: 'contact', lazy: page(() => import('./pages/Contact')) },
          { path: '*', lazy: page(() => import('./pages/NotFound')) },
        ],
      },
    ],
  },
]
