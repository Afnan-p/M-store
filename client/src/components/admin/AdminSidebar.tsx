import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Layers, Store, LogOut, ExternalLink, Smartphone, Headphones, Gift, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/mstore-management-portal/login');
  };

  const navItems = [
    { label: 'Overview', path: '/mstore-management-portal', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'All Products', path: '/mstore-management-portal/products', icon: <Package className="w-4 h-4" /> },
    { label: 'Products Stock', path: '/mstore-management-portal/stock', icon: <Layers className="w-4 h-4" /> },
    { label: 'Offer Products', path: '/mstore-management-portal/offer-products', icon: <Gift className="w-4 h-4" /> },
    { label: 'Offers', path: '/mstore-management-portal/offers', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Showroom Stores', path: '/mstore-management-portal/stores', icon: <Store className="w-4 h-4" /> },
    { label: 'iPhone Segments', path: '/mstore-management-portal/segments', icon: <Layers className="w-4 h-4" /> },
    { label: 'Add New iPhone', path: '/mstore-management-portal/products/new?type=iphone', icon: <Smartphone className="w-4 h-4" /> },
    { label: 'Add Accessory', path: '/mstore-management-portal/products/new?type=accessory', icon: <Headphones className="w-4 h-4" /> },
  ];

  const sidebarContent = (
    <aside className="w-64 bg-white border-r border-zinc-200 h-full flex flex-col justify-between p-4 shrink-0 shadow-sm overflow-y-auto">
      <div className="space-y-6">
        {/* Admin Header Logo */}
        <div className="px-3 py-2 flex items-center justify-between border-b border-zinc-200 pb-4">
          <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-[#E50914] flex items-center justify-center text-white font-black text-lg shadow-sm">
              M
            </div>
            <div>
              <span className="font-bold text-xs text-zinc-900 block tracking-wider">M STORE</span>
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-medium">
                INVENTORY SYSTEM
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              to="/"
              target="_blank"
              title="View Public Website"
              className="p-1.5 text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 text-zinc-500 hover:text-zinc-900 bg-zinc-100 rounded-lg transition-colors"
                aria-label="Close navigation sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* User Profile Info */}
        {user && (
          <div className="px-3.5 py-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 flex items-center justify-center text-xs font-bold text-[#E50914] shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-zinc-900 block truncate">{user.name}</span>
              <span className="text-[10px] text-zinc-500 block truncate">{user.email}</span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/20'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-zinc-200 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar (visible on lg and above) */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0 border-r border-zinc-200 bg-white z-30">
        {sidebarContent}
      </div>

      {/* Mobile Drawer (visible on mobile when isOpen is true) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 w-64 max-w-[80vw] bg-white h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
