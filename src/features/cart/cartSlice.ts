import { AppThunk, RootState } from '../../app/store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import axios from 'axios'

interface CartBook {
  order: number
  isbn: string
  cover: string
  title: string
  quantity: number
  price: number
}

interface offer {
  type: string
  sliceValue?: number
  value: number
}

// const offers: Array<offer> = [
//   { type: 'percentage', value: 4 },
//   { type: 'minus', value: 15 },
//   { type: 'slice', sliceValue: 100, value: 12 },
// ]

export interface CartState {
  value: number
  items: Array<CartBook>
  discount: number
  total: number
  status: 'idle' | 'loading' | 'failed'
}

const initialState: CartState = {
  value: 0,
  items: [],
  discount: 0,
  total: 0,
  status: 'idle',
}

const applyPromo = async (books: Array<CartBook>, soustotal: number) => {
  const codes = books.map((item) => {
    if (item.quantity > 1) {
      let c = ''
      for (let intI = 0; intI < item.quantity; intI++)
        c += item.isbn + (intI < item.quantity - 1 ? ',' : '')
      return c
    } else return item.isbn
  })

  const fetchOffers = async () => {
    return await axios
      .get('https://henri-potier.techx.fr/books/' + codes + '/commercialOffers')
      .then((res) => {
        return res.data.offers
      })
  }

  const getPromos = async () => {
    const promos = await fetchOffers()

    let discount = 0
    promos &&
      promos.forEach((offer: offer) => {
        switch (offer.type) {
          // pourcentage
          case 'percentage':
            const result = (soustotal * offer.value) / 100
            if (offer.value > result) discount = result
            break
          // remise directe
          case 'minus':
            if (offer.value > discount) discount = offer.value
            break
          // remise par tranche
          case 'slice':
            if (offer.sliceValue) {
              const tranche =
                Math.floor(soustotal / offer.sliceValue) * offer.value
              if (tranche > discount) discount = tranche
            }
            break
        }
      })

    return discount
  }

  const result = await getPromos()

  return result
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,

  // Reducers et actions associées
  reducers: {
    addToCart: (state, book: PayloadAction<CartBook>) => {
      const { order, isbn, cover, price, title } = book.payload

      // nouvel item
      if (order < 0) {
        state.items.push({
          order: state.items.length,
          isbn: isbn,
          cover: cover,
          title: title,
          quantity: 1,
          price: price,
        })
      }
      // item déjà existant : mise à jour de la quantité
      else {
        state.items[order].quantity += 1
      }
      state.value += price
    },
    applyDiscount: (state, val: PayloadAction<number>) => {
      state.discount = Number(val.payload)
      state.total = state.value - state.discount
    },
    delCart: (state, order: PayloadAction<number>) => {
      state.value -=
        state.items[order.payload].price * state.items[order.payload].quantity
      state.items.splice(order.payload, 1)
    },
  },
})

export const { addToCart, applyDiscount, delCart } = cartSlice.actions

// Sélecteurs
export const selectCart = (state: RootState) => state.cart.value
export const selectItems = (state: RootState) => state.cart.items
export const selectDiscount = (state: RootState) => state.cart.discount
export const selectTotal = (state: RootState) => state.cart.total

// Ajout d'un livre en vérifiant qu'il n'est pas déjà dans le panier
// Dans ce cas, on récupère l'emplacement du livre en question dans la liste
export const insertBook = (book: CartBook): AppThunk => (
  dispatch,
  getState,
) => {
  const items = selectItems(getState())
  const newBook = { ...book }

  let placement = -1
  items.forEach((item, key) => {
    if (book.isbn === item.isbn) placement = key
  })
  newBook.order = placement
  dispatch(addToCart(newBook))
}

export const checkPromo = (): AppThunk => (dispatch, getState) => {
  const items = selectItems(getState())
  const value = selectCart(getState())

  if (items.length > 0)
    applyPromo(items, value).then((discount) => {
      dispatch(applyDiscount(discount))
    })
  else dispatch(applyDiscount(0))
}

export default cartSlice.reducer
