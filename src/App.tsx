import { Routes, Route, Navigate } from 'react-router'
import LoginPage from '@/features/auth/LoginPage'
import DashboardPage from '@/features/dashboard/DashboardPage'
import ProductsPage from '@/features/products/ProductsPage'
import CreateSalePage from '@/features/sales/CreateSalePage'
import ProtectedRoute from '@/routes/ProtectedRoute'
import Layout from '@/components/Layout'
import ProductFormPage from '@/features/products/ProductFormPage'
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/sales/create" element={<CreateSalePage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
