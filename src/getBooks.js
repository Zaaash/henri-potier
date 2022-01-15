import './getBooks.scss'

import React, { useEffect, useState } from 'react'
import { searchBook, selectBooks } from './features/collec/collecSlice'
import { useAppDispatch, useAppSelector } from './app/hooks'

import Book from './components/book'
import search from './assets/images/search.webp'
import { setCollec } from './features/collec/collecSlice'

export function Getbooks() {
  const dispatch = useAppDispatch()
  const [books, setbooks] = useState()

  // Récupération des données
  const getBooksFromAPI = async () => {
    const response = await fetch(
      'https://henri-potier.techx.fr/books',
    ).then((response) => response.json())

    // const toto = response
    //   .filter((item) => {
    //     return item.title.includes('la')
    //   })
    //   .map((item) => {
    //     return item.title
    //   })
    response.forEach((item) => {
      dispatch(setCollec(item))
    })

    setbooks(response)
  }

  useEffect(() => {
    getBooksFromAPI()
  }, [])

  //Affichage de la liste au scroll
  const handleScroll = () => {
    const list = document
      .getElementsByClassName('booksList')[0]
      .getElementsByTagName('ul')[0]
    if (list.className === '') {
      list.classList.add('on')
      document.getElementById('reveal').classList.add('off')
    }
  }

  // Animation du module de recherche
  const handleSearch = (evt) => {
    const inputSearch = document
      .getElementById('search')
      .getElementsByTagName('input')[0]
    console.log(inputSearch.className)
    if (inputSearch.className === 'on') inputSearch.classList.remove('on')
    else {
      inputSearch.classList.add('on')
      inputSearch.focus()
    }
  }

  // Traitement de la recherche
  // const searchBook = (evt) => {
  //   console.log(evt.target.value)
  //   const toto = books
  //     .filter((item) => {
  //       return item.title.includes(evt.target.value)
  //     })
  //     .map((item) => {
  //       return `<li>${(<Book data={item} />)}</li>`
  //     })
  //   // document
  //   //   .getElementsByClassName('booksList')[0]
  //   //   .getElementsByTagName('ul')[0].innerHTML = toto
  // }

  const collection = useAppSelector(selectBooks)

  return (
    <>
      <div id="search">
        <img
          src={search}
          onClick={handleSearch}
          alt="rechercher un livre en particulier"
          title="rechercher un livre en particulier"
        />
        <input type="text" onChange={dispatch(searchBook)} />
      </div>
      <div className="booksList">
        <div onScroll={handleScroll}>
          <ul>
            {collection &&
              collection.map((book) => {
                return (
                  <li>
                    <Book data={book} />
                  </li>
                )
              })}
            {/* {books &&
              books.map((book) => {
                return (
                  <li>
                    <Book data={book} />
                  </li>
                )
              })} */}
          </ul>
        </div>
      </div>
    </>
  )
}
