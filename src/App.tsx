import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { WishlistModal } from './components/common/WishlistModal';
import { WishlistProvider } from './context/WishlistContext';

// Public Pages
import { HomePage } from './pages/Home';
import { ProductsPage } from './pages/Products';
import { UsedIphonesPage } from './pages/UsedIphones';
import { AccessoriesPage } from './pages/Accessories';
import { OffersPage } from './pages/Offers';
import { ProductDetailsPage } from './pages/ProductDetails';
import { AboutPage } from './pages/About';
import { ContactPage } from './pages/Contact';
import { StoresPage } from './pages/Stores';

// Admin Pages
import { AdminLogin } from './pages/Admin/AdminLogin';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminProducts } from './pages/Admin/AdminProducts';
import { AdminSegments } from './pages/Admin/AdminSegments';
import { AdminNewProduct } from './pages/Admin/AdminNewProduct';
import { AdminEditProduct } from './pages/Admin/AdminEditProduct';

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
  const isAdminRoute = location.pathname.startsWith('/admin');

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
    <WishlistProvider>
      <Router>
        <ScrollToTop />
        <PublicLayout>
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

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/segments" element={<AdminSegments />} />
            <Route path="/admin/products/new" element={<AdminNewProduct />} />
            <Route path="/admin/products/:id/edit" element={<AdminEditProduct />} />
            {/* Catch-all Fallback Route */}
            <Route path="*" element={<HomePage />} />
          </Routes>

          {/* Global Wishlist Modal Drawer */}
          <WishlistModal />
        </PublicLayout>
      </Router>
    </WishlistProvider>
  );
}

export default App;
