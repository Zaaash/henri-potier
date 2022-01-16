import './hpBooks.scss'

import { Cart } from './features/cart/Cart'
import { Getbooks } from './getBooks'
import React from 'react'
import biblio from './assets/images/fond.webp'
import reveal from './assets/images/next.webp'
import { selectTotal } from './features/cart/cartSlice'
import { useAppSelector } from './app/hooks'

export default function HPBooks() {
  const total = useAppSelector(selectTotal)

  const handleNext = (evt) => {
    const list = document
      .getElementsByClassName('booksList')[0]
      .getElementsByTagName('ul')[0]
    if (list.className === '') {
      list.classList.add('search')
      evt.target.classList.add('off')
    }
  }

  return (
    <div className="App">
      <img
        id="biblio"
        src={biblio}
        alt="Fond de l'application représentant une vieille bibliothèque poussiéreuse"
      />{' '}
      <img
        id="reveal"
        src={reveal}
        onClick={handleNext}
        alt="bouton animé pour pousser au défilement des livres"
        title="faire apparaitre la liste des livres..."
      />
      <Getbooks />
      {total > 0 && <Cart />}
    </div>
  )
}
