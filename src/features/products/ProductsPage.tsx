import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Link } from 'react-router'
import { getProducts } from './productApi'
import { useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProduct } from './productApi'
export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10

  const { user } = useAppSelector((state) => state.auth)
  const canManage = user?.role === 'Admin' || user?.role === 'Manager'

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', search, page],
    queryFn: () => getProducts({ search, page, limit }),
    placeholderData: keepPreviousData,
  })

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput)
  }

  const products = data?.data.products ?? []
  const pagination = data?.data.pagination
const queryClient = useQueryClient()

const deleteMutation = useMutation({
  mutationFn: deleteProduct,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
  },
})

const handleDelete = (id: string, name: string) => {
  if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
    deleteMutation.mutate(id)
  }
}
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        {canManage && (
          <Link to="/products/new">
            <Button>Add Product</Button>
          </Link>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-sm">
        <input
          type="text"
          placeholder="Search by name, SKU, category..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {isLoading ? (
          <p className="p-4 text-sm text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="p-4 text-sm text-red-500">Failed to load products.</p>
        ) : products.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No products found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-gray-500">
                <th className="py-2 px-4">Image</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">SKU</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Purchase Price</th>
                <th className="py-2 px-4">Selling Price</th>
                <th className="py-2 px-4">Stock</th>
                {canManage && <th className="py-2 px-4">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b last:border-0">
                  <td className="py-2 px-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="py-2 px-4">{product.sku}</td>
                  <td className="py-2 px-4">{product.category}</td>
                  <td className="py-2 px-4">{product.purchasePrice}</td>
                  <td className="py-2 px-4">{product.sellingPrice}</td>
                  <td
                    className={`py-2 px-4 font-medium ${
                      product.stockQuantity < 5 ? 'text-red-600' : ''
                    }`}
                  >
                    {product.stockQuantity}
                  </td>
                  {canManage && (
                    <td className="py-2 px-4 space-x-3">
                      <Link
                        to={`/products/${product._id}/edit`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        className="text-red-600 text-sm hover:underline"
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p>
            Page {pagination.currentPage} of {pagination.totalPages} (
            {pagination.totalProducts} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
