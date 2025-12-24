import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../lib/api'

export function useAuth() {
  const queryClient = useQueryClient()

  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: authApi.getSession,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['session'], null)
    },
  })

  return {
    user: session?.user ?? null,
    isLoading,
    isAuthenticated: !!session?.user,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
  }
}
