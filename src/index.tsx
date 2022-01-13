import './index.scss'

import * as serviceWorker from './serviceWorker'

import HPBooks from './hpBooks'
import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import fond from './assets/images/fond.webp'
import { store } from './app/store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <img id="fond" src={fond} alt="fond d'habillage flou" />
      <HPBooks />
    </Provider>
  </React.StrictMode>,
  document.getElementById('HPBooks'),
)

serviceWorker.register()
