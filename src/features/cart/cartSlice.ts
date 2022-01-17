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

const offers: Array<offer> = [
  { type: 'percentage', value: 4 },
  { type: 'minus', value: 15 },
  { type: 'slice', sliceValue: 100, value: 12 },
]

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
const applyPromo = (books: Array<CartBook>, soustotal: number) => {
  const codes = books.map((item) => {
    if (item.quantity > 1) {
      let c = ''
      for (let intI = 0; intI < item.quantity; intI++)
        c += item.isbn + (intI < item.quantity - 1 ? ',' : '')
      return c
    } else return item.isbn
  })
  console.log('CODES :', codes)

  const fetchPromos = async () => {
    let promos = offers
    await axios
      .get('https://henri-potier.techx.fr/books/' + codes + '/commercialOffers')
      .then((res) => {
        promos = res.data.offers
      })
    console.log('PROMOS :', promos)

    let discount = 0
    promos &&
      promos.forEach((offer) => {
        switch (offer.type) {
          // pourcentage
          case 'percentage':
            const result = (soustotal * offer.value) / 100
            if (offer.value > result) discount = result
            console.log('perc', result)
            break
          // remise directe
          case 'minus':
            if (offer.value > discount) discount = offer.value
            console.log('value', offer.value)
            break
          // remise par tranche
          case 'slice':
            if (offer.sliceValue) {
              const tranche =
                Math.floor(soustotal / offer.sliceValue) * offer.value
              if (tranche > discount) discount = tranche
              console.log('slice', tranche)
            }
            break
        }
      })
    console.log('PROMESSE :', discount)

    return discount
  }

  // async function getGoodPromo() {
  //   const discount = await fetchPromos()
  //   console.log('REZZZZZZZ :', discount) // 10
  //   return discount
  // }
  // const kiki = getGoodPromo()
  // setTimeout(() => console.log('KIKI :', kiki), 500)

  return 33 //() => await fetchPromos()
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
      const discount = applyPromo(state.items, state.value)
      state.discount = discount
      state.total = state.value - discount
    },
    delCart: (state, order: PayloadAction<number>) => {
      state.value -=
        state.items[order.payload].price * state.items[order.payload].quantity
      const discount = applyPromo(state.items, state.value)
      state.discount = discount
      state.total = state.value - discount
    },
  },
})

export const { addToCart, delCart } = cartSlice.actions

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

export default cartSlice.reducer
