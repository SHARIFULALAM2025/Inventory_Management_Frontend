import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { loginUser } from './authApi'
import { useAppDispatch } from '@/app/hooks'
import { setCredentials } from './authSlice'
import { Button } from '@/components/ui/button'
import { isAxiosError } from 'axios'
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      dispatch(
        setCredentials({
          user: response.data.user,
          token: response.data.token,
        })
      )
      navigate('/dashboard')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {mutation.isError && (
          <p className="text-red-500 text-sm">
            {isAxiosError(mutation.error)
              ? mutation.error.response?.data?.message || 'Login failed'
              : 'Login failed'}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  )
}
