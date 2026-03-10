import { configureStore } from '@reduxjs/toolkit'
import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { authReducer } from '../features/auth/index.ts'
import { chatReducer } from '../features/chat/index.ts'

const chatPersistConfig = {
  key: 'chat',
  storage,
}

const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer)

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: persistedChatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, UnknownAction>
