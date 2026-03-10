import type { ReactNode } from 'react'
import { useAuth } from '../../auth/useAuth.ts'
import { Spinner } from '../Spinner/index.ts'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, isLoggingOut, login } = useAuth()

  if (isLoading || isLoggingOut) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    login()
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}
