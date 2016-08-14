import { connect } from 'react-redux'
import App from './App'
import {readQuestion, saveAnswer, editAnswer} from '../thunks'
import * as SELECT from '../select'

import {updateActiveQuestion} from '../ui/ui-actions'

function mapStateToProps(state) {
  const answers = SELECT.answers(state)
  const ui = state.ui
  const question = ui.question || ''
  return {
    answers,
    question
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onAsk: function(question) {
      dispatch(updateActiveQuestion(question))
    },
    onSaveAnswer: function(question, answer) {
      dispatch(saveAnswer(question, answer))
    },
    onEditAnswer: function(answerId, text) {
      dispatch(editAnswer, answerId, text)
    }
  }
}

const appContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default appContainer

