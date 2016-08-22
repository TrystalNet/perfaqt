import { connect } from 'react-redux'
import App from './App'
import * as THUNK  from '../thunks'
import * as SELECT from '../select'
// import * as UI     from '../ui/ui-actions'

function mapStateToProps(state) {
  const aid = state.ui.aid
  const question = state.ui.question || ''
  const answers = SELECT.rankedAnswers(state, question)
  const questions = SELECT.questions(state).map(question => question.text).sort()
  return {
    aid,
    answers,
    questions,
    question
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onAddFaqt:       () => dispatch(THUNK.addFaqt()),
    onLoad:          () => dispatch(THUNK.load()),
    onSave:          () => dispatch(THUNK.save()),
    onAddAnswer:     text =>dispatch(THUNK.addAnswer(text)),
    onAsk:           question => dispatch(THUNK.askQuestion(question)),
    onSaveQuestion:  question => dispatch(THUNK.saveQuestion(question)),
    onUpdateAnswer:  (aid, text) => dispatch(THUNK.updateAnswer(aid, text)),
    onSetBestAnswer: aid => dispatch(THUNK.setBestAnswer(aid)),
    onActivate     : aid => dispatch(THUNK.activateAnswer(aid)), 
    onQuestionChange: function(question)  {
      // dispatch(updateActiveQuestion(question))
    }
  }
}

const appContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default appContainer

