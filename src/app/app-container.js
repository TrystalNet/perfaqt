import { connect } from 'react-redux'
import App from './App'
import {
  saveAnswer, editAnswer, askQuestion, saveQuestion,
  setBestAnswer, addAnswer
} from '../thunks'
import * as SELECT from '../select'

import {updateActiveQuestion} from '../ui/ui-actions'

function mapStateToProps(state) {
  const question = state.ui.question || ''
  console.log('the question is ', state.ui.question)
  const answers = SELECT.rankedAnswers(state, question)
  return {
    answers,
    question
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onAsk: function(question) {
      dispatch(askQuestion(question))
    },
    onSetBestAnswer: function(question, answerId) {
      dispatch(setBestAnswer(question, answerId))
    },
    onQuestionChange: function(question)  {
      // dispatch(updateActiveQuestion(question))
    },
    onSaveQuestion: function(question) {
      dispatch(saveQuestion(question))
    },
    onSaveAnswer: function(question, answer) {
      dispatch(saveAnswer(question, answer))
    },
    onAddAnswer: function(text) {
      dispatch(addAnswer(text))
    }
  }
}

const appContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default appContainer

