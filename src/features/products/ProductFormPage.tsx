import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { createProduct, updateProduct, getProductById } from './productApi'
import { Button } from '@/components/ui/button'

export default function ProductFormPage() {
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [category, setCategory] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [stockQuantity, setStockQuantity] = useState('')
  const [image, setImage] = useState<File | undefined>(undefined)
  const [existingImageUrl, setExistingImageUrl] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const { data: existingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id as string),
    enabled: isEditMode,
  })

  useEffect(() => {
    if (existingProduct?.data) {
      const p = existingProduct.data
      setName(p.name)
      setSku(p.sku)
      setCategory(p.category)
      setPurchasePrice(String(p.purchasePrice))
      setSellingPrice(String(p.sellingPrice))
      setStockQuantity(String(p.stockQuantity))
      setExistingImageUrl(p.imageUrl)
    }
  }, [existingProduct])

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        name,
        sku,
        category,
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        stockQuantity: Number(stockQuantity),
        image,
      }
      return isEditMode
        ? updateProduct(id as string, payload)
        : createProduct(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      navigate('/products')
    },
    onError: (err) => {
      setErrorMsg(
        isAxiosError(err)
          ? err.response?.data?.message || 'Something went wrong'
          : 'Something went wrong'
      )
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!isEditMode && !image) {
      setErrorMsg('Product image is required')
      return
    }

    mutation.mutate()
  }

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? 'Edit Product' : 'Add Product'}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Purchase Price
            </label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              required
              min="0"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Selling Price
            </label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              required
              min="0"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
            min="0"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Product Image {isEditMode && '(leave empty to keep current image)'}
          </label>
          {isEditMode && existingImageUrl && !image && (
            <img
              src={existingImageUrl}
              alt="Current"
              className="w-16 h-16 object-cover rounded mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0])}
            className="w-full text-sm"
          />
        </div>

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending
              ? 'Saving...'
              : isEditMode
                ? 'Update Product'
                : 'Create Product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/products')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
