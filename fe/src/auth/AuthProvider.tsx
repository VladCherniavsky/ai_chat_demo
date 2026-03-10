import {
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { User } from 'oidc-client-ts'
import { hasCognito } from './config.ts'
import { userManager } from './userManager.ts'
import { useAppDispatch } from '../store/hooks.ts'
import { setToken, clearToken } from '../features/auth/index.ts'
import { AuthContext } from './AuthContext.ts'

const DEV_USER = {
  idToken: '',
  userId: 'dev-user',
  email: 'dev@local',
} as const

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(hasCognito)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!hasCognito || !userManager) {
      dispatch(setToken(DEV_USER))
      return
    }

    const um = userManager
    um.getUser().then((u) => {
      const validUser = u && !u.expired ? u : null
      setUser(validUser)
      if (validUser) {
        dispatch(setToken({
          idToken: validUser.id_token ?? '',
          userId: validUser.profile.sub,
          email: validUser.profile?.email ?? '',
        }))
      }
      setIsLoading(false)
    })

    const onUserLoaded = (u: User) => {
      setUser(u)
      dispatch(setToken({
        idToken: u.id_token ?? '',
        userId: u.profile.sub,
        email: u.profile?.email ?? '',
      }))
    }

    const onUserUnloaded = () => {
      setUser(null)
      dispatch(clearToken())
    }

    um.events.addUserLoaded(onUserLoaded)
    um.events.addUserUnloaded(onUserUnloaded)

    return () => {
      um.events.removeUserLoaded(onUserLoaded)
      um.events.removeUserUnloaded(onUserUnloaded)
    }
  }, [dispatch])

  const login = useCallback(async () => {
    if (userManager) await userManager.signinRedirect()
  }, [])

  const logout = useCallback(async () => {
    if (!userManager) {
      dispatch(clearToken())
      return
    }
    setIsLoggingOut(true)
    await userManager.signoutRedirect()
  }, [dispatch])

  const isAuthenticated =
    hasCognito && userManager
      ? !!user && !user.expired
      : true

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, isLoggingOut, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
