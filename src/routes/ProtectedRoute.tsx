import { Navigate, Outlet } from 'react-router'
import { useAppSelector } from '@/app/hooks'

interface ProtectedRouteProps {
  allowedRoles?: ('Admin' | 'Manager' | 'Employee')[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, token } = useAppSelector((state) => state.auth)

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
