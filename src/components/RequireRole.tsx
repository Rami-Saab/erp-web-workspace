import { ReactNode } from 'react';
import { useERPContext } from '../contexts/ERPContext';

type Role = 'admin' | 'sales' | 'warehouse' | 'finance';

interface RequireRoleProps {
  children: ReactNode;
  allowedRoles: Role[];
  fallback?: ReactNode;
}

/**
 * RequireRole - A reusable wrapper component for role-based access control
 * 
 * This component checks if the current user's role is in the allowedRoles array.
 * If not, it renders the fallback (or null if not provided).
 * 
 * Usage:
 * <RequireRole allowedRoles={['admin']}>
 *   <AdminOnlyComponent />
 * </RequireRole>
 */
export function RequireRole({ children, allowedRoles, fallback = null }: RequireRoleProps) {
  const { role } = useERPContext();

  if (!allowedRoles.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
