import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminGuard } from './AdminGuard';

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
  return (
    <AdminGuard>
      <div className="min-h-screen bg-zinc-50 flex text-zinc-900 font-sans">
        <AdminSidebar />

        <main className="flex-1 min-w-0 flex flex-col">
          {/* Header Bar */}
          <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-8 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
          </header>

          {/* Body Content */}
          <div className="p-8 flex-1 space-y-6">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
};
