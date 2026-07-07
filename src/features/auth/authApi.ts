import api from '@/lib/axios'

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Manager' | 'Employee'
}

export interface LoginResponse {
  statusCode: number
  data: {
    token: string
    user: AuthUser
  }
  message: string
  success: boolean
}

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', payload)
  return response.data
}
