import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { WishlistModal } from './components/common/WishlistModal';
import { WishlistProvider } from './context/WishlistContext';
import { StoreProvider } from './context/StoreContext';

// Eagerly Loaded Public Pages for Instant First Paint
import { HomePage } from './pages/Home';
import { ProductsPage } from './pages/Products';
import { UsedIphonesPage } from './pages/UsedIphones';
import { AccessoriesPage } from './pages/Accessories';
import { OffersPage } from './pages/Offers';
import { ProductDetailsPage } from './pages/ProductDetails';
import { AboutPage } from './pages/About';
import { ContactPage } from './pages/Contact';
import { StoresPage } from './pages/Stores';

// Lazy Loaded Admin Management Portal Routes
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('./pages/Admin/AdminProducts').then((m) => ({ default: m.AdminProducts })));
const AdminStockPage = lazy(() => import('./pages/Admin/AdminStock').then((m) => ({ default: m.AdminStockPage })));
const AdminOffers = lazy(() => import('./pages/Admin/AdminOffers').then((m) => ({ default: m.AdminOffers })));
const AdminOfferProducts = lazy(() => import('./pages/Admin/AdminOfferProducts').then((m) => ({ default: m.AdminOfferProducts })));
const AdminSegments = lazy(() => import('./pages/Admin/AdminSegments').then((m) => ({ default: m.AdminSegments })));
const AdminStores = lazy(() => import('./pages/Admin/AdminStores').then((m) => ({ default: m.AdminStores })));
const AdminNewProduct = lazy(() => import('./pages/Admin/AdminNewProduct').then((m) => ({ default: m.AdminNewProduct })));
const AdminEditProduct = lazy(() => import('./pages/Admin/AdminEditProduct').then((m) => ({ default: m.AdminEditProduct })));

// Loading Spinner Suspense Fallback
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] text-zinc-600">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-[#E50914] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Loading M Store Portal...</span>
    </div>
  </div>
);

// Scroll to top on navigation helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout wrapper for customer facing pages vs admin portal
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/mstore-management-portal');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F6] text-zinc-900">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <WishlistProvider>
        <Router>
          <ScrollToTop />
          <PublicLayout>
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/iphones" element={<ProductsPage />} />
                <Route path="/iphones/:segmentSlug" element={<ProductsPage />} />
                <Route path="/used-iphones" element={<UsedIphonesPage />} />
                <Route path="/used-iphones/:segmentSlug" element={<UsedIphonesPage />} />
                <Route path="/accessories" element={<AccessoriesPage />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/stores" element={<StoresPage />} />

                {/* Redirect old /admin routes to customer homepage without exposing portal */}
                <Route path="/admin" element={<Navigate to="/" replace />} />
                <Route path="/admin/*" element={<Navigate to="/" replace />} />

                {/* Production Admin Management Portal Routes */}
                <Route path="/mstore-management-portal/login" element={<AdminLogin />} />
                <Route path="/mstore-management-portal" element={<AdminDashboard />} />
                <Route path="/mstore-management-portal/products" element={<AdminProducts />} />
                <Route path="/mstore-management-portal/stock" element={<AdminStockPage />} />
                <Route path="/mstore-management-portal/offer-products" element={<AdminOfferProducts />} />
                <Route path="/mstore-management-portal/offers" element={<AdminOffers />} />
                <Route path="/mstore-management-portal/segments" element={<AdminSegments />} />
                <Route path="/mstore-management-portal/stores" element={<AdminStores />} />
                <Route path="/mstore-management-portal/products/new" element={<AdminNewProduct />} />
                <Route path="/mstore-management-portal/products/:id/edit" element={<AdminEditProduct />} />

                {/* Catch-all Fallback Route */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Suspense>

            {/* Global Wishlist Modal Drawer */}
            <WishlistModal />
          </PublicLayout>
        </Router>
      </WishlistProvider>
    </StoreProvider>
  );
}

export default App;
