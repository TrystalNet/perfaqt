import React from 'react';
import Thunk from 'redux-thunk'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
// import {openIDB} from './idb'

import * as THUNK from './thunks'
import App from './app/App'
import reducer from './reducers/reducer'

console.log('Starting version 161025b')

const config = {
  apiKey: 'AIzaSyCJxPq5CbWbMN14yMmI7lIt0_HNEFf1sdw',
  authDomain: 'perfaqt-141604.firebaseapp.com',
  databaseURL: 'https://perfaqt-141604.firebaseio.com',
  storageBucket: 'perfaqt-141604.appspot.com'
}
firebase.initializeApp(config) // this just injects the config stuff into firebase

function startup(idb) {
  const store = createStore(reducer, applyMiddleware(Thunk.withExtraArgument({idb})))
  render(<Provider store={store}><App /></Provider>, document.getElementById('root'))
  store.dispatch(THUNK.initFirebase())
}

const req = window.indexedDB.open('perfaqt', 17)
req.onsuccess = event => startup(event.target.result)
req.onupgradeneeded = function(event) {
  const db = event.target.result
  if(db.objectStoreNames.contains('scores')) db.deleteObjectStore('scores')
  if(db.objectStoreNames.contains('answers')) db.deleteObjectStore('answers')
  if(db.objectStoreNames.contains('questions')) db.deleteObjectStore('questions')
  if(!db.objectStoreNames.contains('searches')) db.createObjectStore('searches', {keyPath:'text'})
  const transaction = event.target.transaction
  transaction.oncomplete = e => startup(db)
}
