import './getBooks.scss'

import React, { useEffect, useState } from 'react'

import Book from './components/book'
import search from './assets/images/search.webp'

export function Getbooks() {
  const [books, setbooks] = useState([])
  const [searchRequest, setSearchResult] = useState('')

  // Récupération des données
  const getBooksFromAPI = async () => {
    const response = await fetch(
      'https://henri-potier.techx.fr/books',
    ).then((response) => response.json())

    setbooks(response)
  }

  useEffect(() => {
    getBooksFromAPI()
  }, [])

  // Affichage de la liste au scroll
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

    if (inputSearch.className === 'on') inputSearch.classList.remove('on')
    else {
      inputSearch.classList.add('on')
      inputSearch.focus()
    }
  }

  // Traitement de la recherche
  const searchBook = (evt) => {
    document
      .getElementsByClassName('booksList')[0]
      .getElementsByTagName('ul')[0]
      .classList.add('search')
    setSearchResult(evt.target.value)
  }

  return (
    <>
      <div id="search">
        <img
          src={search}
          onClick={handleSearch}
          alt="rechercher un livre en particulier"
          title="rechercher un livre en particulier"
        />
        <input type="text" onChange={searchBook} onBlur={handleSearch} />
      </div>
      <div className="booksList">
        <div onScroll={handleScroll}>
          <ul>
            {books &&
              books
                .filter((book) => {
                  const lowCaseTitle = book.title.toLowerCase()
                  return lowCaseTitle.includes(searchRequest.toLowerCase())
                })
                .map((book) => {
                  return (
                    <li key={book.isbn}>
                      <Book data={book} />
                    </li>
                  )
                })}
          </ul>
        </div>
      </div>
    </>
  )
}
