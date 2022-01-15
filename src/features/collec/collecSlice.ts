import { AppThunk, RootState } from '../../app/store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'

import { useAppSelector } from '../../app/hooks'

// Définitions
interface collecBook {
  isbn: string
  cover: string
  title: string
  synopsis: string
  price: number
}

export interface Collection {
  collection: Array<collecBook>
  books: Array<collecBook>
  init: boolean
}

// export function Getbooks() {
//   const [books, setbooks] = useState()

//   // Récupération des données
//   const getBooksFromAPI = async () => {
//     const response = await fetch(
//       'https://henri-potier.techx.fr/books',
//     ).then((response) => response.json())

//     setbooks(response)
//   }

//   useEffect(() => {
//     getBooksFromAPI()
//   }, [])
// }
// const too = () => {
//   Getbooks()
// }

const initialState: Collection = {
  collection: [],
  books: [],
  init: true,
}

// Slice
export const collecSlice = createSlice({
  name: 'collec',
  initialState,

  reducers: {
    setCollec: (state, book: PayloadAction<collecBook>) => {
      const { isbn, cover, price, title, synopsis } = book.payload

      if (state.init) {
        state.collection.push({
          isbn: isbn,
          cover: cover,
          title: title,
          synopsis: synopsis,
          price: price,
        })
        state.init = false
      }
      state.books.push({
        isbn: isbn,
        cover: cover,
        title: title,
        synopsis: synopsis,
        price: price,
      })
    },
  },
})

export const { setCollec } = collecSlice.actions

// Sélecteurs
export const selectCollec = (state: RootState) => state.collec.collection
export const selectBooks = (state: RootState) => state.collec.books

// Ajout d'un livre en vérifiant qu'il n'est pas déjà dans le panier
// Dans ce cas, on récupère l'emplacement du livre en question dans la liste
export const searchBook = (keyword: string): AppThunk => (
  dispatch,
  getState,
) => {
  const newList = selectCollec(getState())
  console.log('BOOOOOOOOOOOOOOOOOOOOKS :', newList)
  newList
    .filter((item) => {
      return item.title.includes(keyword)
    })
    .forEach((book) => {
      dispatch(setCollec(book))
    })
}

export default collecSlice.reducer
