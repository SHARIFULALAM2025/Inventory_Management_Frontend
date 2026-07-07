import api from '@/lib/axios'

export interface SaleItemInput {
  productId: string
  quantity: number
}

export interface CreateSalePayload {
  items: SaleItemInput[]
}

export interface SaleItemResult {
  product: string
  quantity: number
  priceAtSale: number
}

export interface SaleResult {
  _id: string
  items: SaleItemResult[]
  grandTotal: number
  createdBy: string
  createdAt: string
}

export interface CreateSaleResponse {
  statusCode: number
  data: SaleResult
  message: string
  success: boolean
}

export const createSale = async (
  payload: CreateSalePayload
): Promise<CreateSaleResponse> => {
  const response = await api.post<CreateSaleResponse>('/sales', payload)
  return response.data
}
