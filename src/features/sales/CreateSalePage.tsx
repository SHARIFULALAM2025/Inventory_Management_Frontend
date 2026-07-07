import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { getProducts } from '@/features/products/productApi'
import { createSale } from './saleApi'
import { Button } from '@/components/ui/button'

interface SaleRow {
  productId: string
  quantity: number
}

export default function CreateSalePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [rows, setRows] = useState<SaleRow[]>([{ productId: '', quantity: 1 }])
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['all-products-for-sale'],
    queryFn: () => getProducts({ limit: 1000 }),
  })

  const products = productsData?.data.products ?? []

  const mutation = useMutation({
    mutationFn: createSale,
    onSuccess: (response) => {
      setSuccessMsg(
        `Sale created successfully! Grand Total: ${response.data.grandTotal}`
      )
      setErrorMsg('')
      setRows([{ productId: '', quantity: 1 }])
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['all-products-for-sale'] })
    },
    onError: (err) => {
      setSuccessMsg('')
      setErrorMsg(
        isAxiosError(err)
          ? err.response?.data?.message || 'Failed to create sale'
          : 'Failed to create sale'
      )
    },
  })

  const handleRowChange = (
    index: number,
    field: keyof SaleRow,
    value: string
  ) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? { ...row, [field]: field === 'quantity' ? Number(value) : value }
          : row
      )
    )
  }

  const addRow = () => {
    setRows((prev) => [...prev, { productId: '', quantity: 1 }])
  }

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  const getProductPrice = (productId: string) => {
    const product = products.find((p) => p._id === productId)
    return product?.sellingPrice ?? 0
  }

  const grandTotal = rows.reduce((sum, row) => {
    return sum + getProductPrice(row.productId) * (row.quantity || 0)
  }, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    const validRows = rows.filter((r) => r.productId && r.quantity > 0)

    if (validRows.length === 0) {
      setErrorMsg('Please select at least one product with a valid quantity')
      return
    }

    mutation.mutate({
      items: validRows.map((r) => ({
        productId: r.productId,
        quantity: r.quantity,
      })),
    })
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Create Sale</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading products...</p>
        ) : (
          <>
            {rows.map((row, index) => (
              <div key={index} className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Product
                  </label>
                  <select
                    value={row.productId}
                    onChange={(e) =>
                      handleRowChange(index, 'productId', e.target.value)
                    }
                    required
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="">Select a product</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} (Stock: {p.stockQuantity}, Price:{' '}
                        {p.sellingPrice})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-28">
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={row.quantity}
                    onChange={(e) =>
                      handleRowChange(index, 'quantity', e.target.value)
                    }
                    required
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeRow(index)}
                  disabled={rows.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addRow}>
              + Add Another Product
            </Button>

            <div className="text-right text-lg font-bold pt-2 border-t">
              Grand Total: {grandTotal}
            </div>

            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            {successMsg && (
              <p className="text-green-600 text-sm">{successMsg}</p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating Sale...' : 'Create Sale'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
