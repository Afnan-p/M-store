import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminGuard } from './AdminGuard';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  action,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="h-screen w-screen bg-zinc-50 flex text-zinc-900 font-sans overflow-hidden">
        {/* Fixed Desktop & Mobile Drawer Sidebar */}
        <AdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

        {/* Independently Scrollable Main Area */}
        <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto relative scroll-smooth">
          {/* Header Bar */}
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-xl border border-zinc-200 transition-colors shrink-0"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-zinc-900 tracking-tight truncate">{title}</h1>
                {subtitle && <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 line-clamp-1">{subtitle}</p>}
              </div>
            </div>
            {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
          </header>

          {/* Body Content */}
          <div className="p-3.5 sm:p-6 lg:p-8 flex-1 space-y-6 max-w-full pb-16 sm:pb-8">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
};
