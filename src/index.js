import React from 'react';
import Thunk from 'redux-thunk'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import * as THUNK from './thunks'
import App from './app/app-container'

import FAQTS   from './faqts/faqts-reducer'
import SEARCHES from './searches/searches-reducer'
import SCORES    from './scores/scores-reducer'
import UI        from './ui/ui-reducer'

function reducer(state={}, action) {
  const newState = {
    faqts     : FAQTS(state.faqts, action),
    searches  : SEARCHES(state.searches, action),
    scores    : SCORES(state.scores, action),
    ui        : UI(state.ui, action)
  }
  if(action.type !== 'UPDATE_FAQT') console.log(action.type)
  return newState
}

const store = createStore(reducer, applyMiddleware(Thunk))

render(<Provider store={store}><App /></Provider>, document.getElementById('root'))

store.dispatch(THUNK.load())


