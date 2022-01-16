import './book.scss'

import React from 'react'
import { insertBook } from '../features/cart/cartSlice'
import { useAppDispatch } from '../app/hooks'

export default function Book(props) {
  const dispatch = useAppDispatch()
  const { isbn, cover, price, synopsis, title } = props.data

  let description = ''
  synopsis.forEach((parag) => {
    description += parag + '<br /><br />'
  })
  const desc = synopsis[0].substring(0, 250) + '...'

  let ifPlus = false

  const handlePlus = (evt) => {
    ifPlus = !ifPlus

    if (ifPlus) {
      evt.target.parentElement.parentElement.classList.add('plus')
      evt.target.parentElement.parentElement.getElementsByClassName(
        'desc',
      )[0].innerHTML = description
    } else {
      evt.target.parentElement.parentElement.classList.remove('plus')
      evt.target.parentElement.parentElement.getElementsByClassName(
        'desc',
      )[0].innerHTML = '<p>' + desc + '</p>'
    }
  }

  const addBook = (evt) => {
    if (ifPlus) handlePlus(evt)
    dispatch(insertBook(props.data))
  }

  return (
    <div id={isbn} className="book">
      <div>
        <img src={cover} onClick={handlePlus} alt="visuel du livre" />
        <button aria-label="Ajouter ce livre dans le panier" onClick={addBook}>
          ajouter
        </button>
      </div>
      <div>
        <h2 onClick={handlePlus}>{title}</h2>
        <div className="desc">
          <p>{desc}</p>
        </div>
        <div className="price">{price}€</div>
        <button onClick={handlePlus}>X</button>
      </div>
    </div>
  )
}
