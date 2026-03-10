import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { hasCognito } from '../../auth/config.ts'
import { userManager } from '../../auth/userManager.ts'
import { Spinner } from '../../components/Spinner/index.ts'

export function CallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    if (!hasCognito || !userManager) {
      navigate('/')
      return
    }

    userManager
      .signinRedirectCallback()
      .then(() => navigate('/'))
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
  }, [navigate])

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          Authentication failed: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}
