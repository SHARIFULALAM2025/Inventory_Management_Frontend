import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from './dashboardApi'

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  })

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load dashboard: {(error as Error).message}
      </div>
    )
  }

  const stats = data?.data

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-3xl font-bold mt-1">{stats?.totalProducts ?? 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-3xl font-bold mt-1">{stats?.totalSales ?? 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Low Stock Products</p>
          <p className="text-3xl font-bold mt-1 text-red-600">
            {stats?.lowStockCount ?? 0}
          </p>
        </div>
      </div>

      {/* Low Stock Products Table */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Low Stock Products</h2>

        {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-gray-500">
                <th className="py-2">Name</th>
                <th className="py-2">SKU</th>
                <th className="py-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowStockProducts.map((product) => (
                <tr key={product._id} className="border-b last:border-0">
                  <td className="py-2">{product.name}</td>
                  <td className="py-2">{product.sku}</td>
                  <td className="py-2 text-red-600 font-medium">
                    {product.stockQuantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-sm">No low stock products.</p>
        )}
      </div>
    </div>
  )
}
