import api from '@/lib/axios'

export interface LowStockProduct {
  _id: string
  name: string
  sku: string
  stockQuantity: number
}

export interface DashboardStats {
  totalProducts: number
  totalSales: number
  lowStockCount: number
  lowStockProducts: LowStockProduct[]
}

export interface DashboardResponse {
  statusCode: number
  data: DashboardStats
  message: string
  success: boolean
}

export const getDashboardStats = async (): Promise<DashboardResponse> => {
  const response = await api.get<DashboardResponse>('/dashboard')
  return response.data
}
