"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface SidebarItem {
  label: string;
  href: string;
  icon: string;
  permission?: {
    resource: string;
    action: 'read' | 'write' | 'delete';
  };
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: '📊'
  },
  {
    label: 'Customers',
    href: '/customers',
    icon: '👥',
    permission: { resource: 'customers', action: 'read' }
  },
  {
    label: 'Loan Applications',
    href: '/loans/applications',
    icon: '📋',
    permission: { resource: 'loans', action: 'read' }
  },
  {
    label: 'Active Loans',
    href: '/loans',
    icon: '💰',
    permission: { resource: 'loans', action: 'read' }
  },
  {
    label: 'Payments',
    href: '/payments',
    icon: '💳',
    permission: { resource: 'payments', action: 'read' }
  },
  {
    label: 'Payment History',
    href: '/payments/history',
    icon: '🧾',
    permission: { resource: 'payments', action: 'read' }
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: '📈',
    permission: { resource: 'reports', action: 'read' }
  },
  {
    label: 'User Management',
    href: '/admin/users',
    icon: '⚙️',
    permission: { resource: 'users', action: 'read' }
  }
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { canAccess } = useAuth();

  const visibleItems = sidebarItems.filter(item => {
    if (!item.permission) return true;
    return canAccess(item.permission.resource, item.permission.action);
  });

  return (
    <div className={cn(
      "bg-slate-900 text-white h-screen transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold">BankSystem</h1>
              <p className="text-slate-300 text-sm">Loan Management</p>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center p-3 rounded-lg transition-colors group",
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "hover:bg-slate-800 text-slate-200"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-slate-700">
        {!isCollapsed ? (
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              👤
            </div>
            <p className="text-sm font-medium">Logged In</p>
            <p className="text-xs text-slate-400">Banking System</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              👤
            </div>
          </div>
        )}
      </div>
    </div>
  );
}