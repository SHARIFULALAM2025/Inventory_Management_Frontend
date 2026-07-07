import { Outlet, Link, useNavigate, useLocation } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      roles: ['Admin', 'Manager', 'Employee'],
    },
    {
      path: '/products',
      label: 'Products',
      roles: ['Admin', 'Manager', 'Employee'],
    },
    {
      path: '/sales/create',
      label: 'Create Sale',
      roles: ['Admin', 'Manager', 'Employee'],
    },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Mini ERP</h2>
          <p className="text-sm text-gray-500">
            {user?.name} ({user?.role})
          </p>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems
            .filter((item) => user && item.roles.includes(user.role))
            .map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
