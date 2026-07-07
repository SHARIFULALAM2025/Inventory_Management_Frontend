import api from '@/lib/axios'
import type { ProductsResponse } from '@/types/product'
import type { Product } from '@/types/product'
export interface GetProductsParams {
  search?: string
  page?: number
  limit?: number
}

export const getProducts = async (
  params: GetProductsParams
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>('/products', { params })
  return response.data
}

export interface ProductFormData {
  name: string
  sku: string
  category: string
  purchasePrice: number
  sellingPrice: number
  stockQuantity: number
  image?: File
}

interface SingleProductResponse {
  statusCode: number
  data: Product
  message: string
  success: boolean
}

const buildFormData = (data: ProductFormData): FormData => {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('sku', data.sku)
  formData.append('category', data.category)
  formData.append('purchasePrice', String(data.purchasePrice))
  formData.append('sellingPrice', String(data.sellingPrice))
  formData.append('stockQuantity', String(data.stockQuantity))
  if (data.image) {
    formData.append('image', data.image)
  }
  return formData
}

export const createProduct = async (
  data: ProductFormData
): Promise<SingleProductResponse> => {
  const formData = buildFormData(data)
  const response = await api.post<SingleProductResponse>(
    '/products',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return response.data
}

export const updateProduct = async (
  id: string,
  data: ProductFormData
): Promise<SingleProductResponse> => {
  const formData = buildFormData(data)
  const response = await api.put<SingleProductResponse>(
    `/products/${id}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return response.data
}

export const getProductById = async (
  id: string
): Promise<SingleProductResponse> => {
  const response = await api.get<SingleProductResponse>(`/products/${id}`)
  return response.data
}
interface DeleteProductResponse {
  statusCode: number
  data: null
  message: string
  success: boolean
}

export const deleteProduct = async (
  id: string
): Promise<DeleteProductResponse> => {
  const response = await api.delete<DeleteProductResponse>(`/products/${id}`)
  return response.data
}