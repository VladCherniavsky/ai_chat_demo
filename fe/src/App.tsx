import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/index.ts'
import { AuthGuard } from './components/AuthGuard/index.ts'
import { CallbackPage } from './pages/CallbackPage/index.ts'
import { ChatPage } from './pages/ChatPage/index.ts'

const withAuthGuard = (component: React.ReactNode) => {
  return (
    <AuthGuard>
      {component}
    </AuthGuard>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/callback" element={<CallbackPage />} />
          <Route
            path="/*"
            element={withAuthGuard(<ChatPage />)}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
