import { connect } from 'react-redux'
import App from './App'
import * as THUNK  from '../thunks'
import * as SELECT from '../select'

function mapStateToProps(state) {
  const { faqId, search, connected } = state.ui
  const faqts = SELECT.getFaqts(state, faqId, search) 
  return { faqts, connected }
}

function mapDispatchToProps(dispatch) {
  return {
    onAddFaqt      : () => dispatch(THUNK.addFaqt()),
    onLogin        : (email,password) => dispatch(THUNK.login(email, password)),
    onSignup       : (email,password) => dispatch(THUNK.signup(email, password))
  }
}

const appContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default appContainer

