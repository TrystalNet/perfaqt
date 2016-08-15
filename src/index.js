import React from 'react';
import Thunk from 'redux-thunk'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import App from './app/app-container'
import { initDatabase } from './thunks'

import ANSWERS   from './answers/answers-reducer'
import QUESTIONS from './questions/questions-reducer'
import SCORES    from './scores/scores-reducer'
import UI        from './ui/ui-reducer'

function reducer(state={}, action) {
  const newState = {
    answers  : ANSWERS(state.answers, action),
    questions: QUESTIONS(state.questions, action),
    scores   : SCORES(state.scores, action),
    ui       : UI(state.ui, action)
  }
  console.log(action.type)
  return newState
}

const store = createStore(reducer, applyMiddleware(Thunk))
store.dispatch(initDatabase())

render(<Provider store={store}><App /></Provider>, document.getElementById('root'))


