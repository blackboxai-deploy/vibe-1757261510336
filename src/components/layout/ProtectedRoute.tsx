"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { User } from '@/lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: User['role'];
  requiredPermission?: {
    resource: string;
    action: 'read' | 'write' | 'delete';
  };
}

export function ProtectedRoute({ children, requiredRole, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole, canAccess } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      if (requiredRole && !hasRole(requiredRole)) {
        router.push('/unauthorized');
        return;
      }

      if (requiredPermission && !canAccess(requiredPermission.resource, requiredPermission.action)) {
        router.push('/unauthorized');
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [isAuthenticated, hasRole, canAccess, router, requiredRole, requiredPermission]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}