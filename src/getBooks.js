import './getBooks.scss'

import React, { useEffect, useState } from 'react'

import Book from './components/book'

export function Getbooks() {
  const [books, setbooks] = useState()

  // Function to collect data
  const getBooksFromAPI = async () => {
    const response = await fetch(
      'https://henri-potier.techx.fr/books',
    ).then((response) => response.json())

    setbooks(response)
  }

  useEffect(() => {
    getBooksFromAPI()
  }, [])

  const handleScroll = () => {
    const list = document
      .getElementsByClassName('booksList')[0]
      .getElementsByTagName('ul')[0]
    if (list.className === '') {
      list.classList.add('on')
      document.getElementById('reveal').classList.add('off')
    }
  }

  return (
    <div className="booksList">
      <div onScroll={handleScroll}>
        <ul>
          {books &&
            books.map((book) => (
              <li>
                <Book data={book} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
