import { connect } from 'react-redux'
import App from './App'
import {
  askQuestion, saveQuestion,
  setBestAnswer, addAnswer, updateAnswer,
  save
} from '../thunks'
import * as SELECT from '../select'

import {updateActiveQuestion} from '../ui/ui-actions'

function mapStateToProps(state) {
  const question = state.ui.question || ''
  const answers = SELECT.rankedAnswers(state, question)
  const questions = SELECT.questions(state).map(question => question.text).sort()
  return {
    answers,
    questions,
    question
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSave: function() {
      dispatch(save())
    },
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
    onAddAnswer: function(text) {
      dispatch(addAnswer(text))
    },
    onUpdateAnswer: function(aid, text) {
      dispatch(updateAnswer(aid, text))
    }
  }
}

const appContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default appContainer

