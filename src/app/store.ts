import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'

import cartReducer from '../features/cart/cartSlice'
import collecReducer from '../features/collec/collecSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    collec: collecReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
