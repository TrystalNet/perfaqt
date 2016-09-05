import React from 'react';
import Thunk from 'redux-thunk'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

import * as THUNK from './thunks'
import App from './app/app-container'

import FAQTS   from './faqts/faqts-reducer'
import SEARCHES from './searches/searches-reducer'
import SCORES    from './scores/scores-reducer'
import UI        from './ui/ui-reducer'

const config = {
  apiKey: 'AIzaSyCJxPq5CbWbMN14yMmI7lIt0_HNEFf1sdw',
  authDomain: 'perfaqt-141604.firebaseapp.com',
  databaseURL: 'https://perfaqt-141604.firebaseio.com',
  storageBucket: 'perfaqt-141604.appspot.com'
}

const app = firebase.initializeApp(config)
const auth = firebase.auth()
const db = firebase.database()

function reducer(state={}, action) {
  const newState = {
    faqts     : FAQTS(state.faqts, action),
    searches  : SEARCHES(state.searches, action),
    scores    : SCORES(state.scores, action),
    ui        : UI(state.ui, action)
  }
  return newState
}

const store = createStore(reducer, applyMiddleware(Thunk))

render(<Provider store={store}><App /></Provider>, document.getElementById('root'))
store.dispatch(THUNK.firebaseStuff(app, auth, db))


