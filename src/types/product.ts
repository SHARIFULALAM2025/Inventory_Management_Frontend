export interface Product {
  _id: string
  name: string
  sku: string
  category: string
  purchasePrice: number
  sellingPrice: number
  stockQuantity: number
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  totalProducts: number
  currentPage: number
  totalPages: number
  limit: number
}

export interface ProductsResponse {
  statusCode: number
  data: {
    products: Product[]
    pagination: Pagination
  }
  message: string
  success: boolean
}
