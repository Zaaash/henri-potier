import './Cart.scss'

import {
  delCart,
  selectCart,
  selectDiscount,
  selectItems,
  selectTotal,
} from './cartSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

import React from 'react'

const handleBuy = () => {
  document
    .getElementsByClassName('booksList')[0]
    .getElementsByTagName('ul')[0]
    .classList.remove('on')
  document.getElementById('cart')?.classList.add('off')
}

export function Cart() {
  const cart = useAppSelector(selectCart)
  const mybooks = useAppSelector(selectItems)
  const discount = useAppSelector(selectDiscount)
  const total = useAppSelector(selectTotal)
  const dispatch = useAppDispatch()

  return (
    <div id="cart">
      <ul>
        {mybooks.map((book, key) => {
          return (
            <li key={key}>
              <div>
                <img src={book.cover} alt="visuel de livre dans le panier" />
              </div>
              <div>{book.title}</div>
              <div>{book.quantity}</div>
              <div>x</div>
              <div>{book.price}€</div>
              <button
                onClick={() => dispatch(delCart(key))}
                title={'supprimer le livre «' + book.title + '» du panier'}
              >
                X
              </button>
            </li>
          )
        })}
      </ul>

      <div className="resume">
        <ul>
          <li>
            <div>sous-total :</div>
            <div>{cart}€</div>
          </li>
          <li className="discount">
            <div>formule magique :</div>
            <div>-{discount}€</div>
          </li>
          <li className="total">
            <div>total :</div>
            <div>{total}€</div>
          </li>
          <li>
            <button onClick={handleBuy}>commander</button>
          </li>
        </ul>
      </div>
    </div>
  )
}
