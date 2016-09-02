import { connect } from 'react-redux'
import App from './App'
import * as THUNK  from '../thunks'
import * as SELECT from '../select'

function mapStateToProps(state) {
  const { broadcast, connected, faqtId } = state.ui
  const search = state.ui.search || ''
  const faqts = SELECT.rankedFaqts(state, search)
  const searches = SELECT.searches(state)
  return { faqtId, faqts, searches, search, broadcast, connected }
}

function mapDispatchToProps(dispatch) {
  return {
    onAddFaqt      : () => dispatch(THUNK.addFaqt()),
    onAsk          : search => dispatch(THUNK.doSearch(search)),
    onSaveSearch   : search => dispatch(THUNK.saveSearch(search)),
    onUpdateFaqt   : (faqtId, text) => dispatch(THUNK.updateFaqt(faqtId, text)),
    onSetBestFaqt  : faqtId => dispatch(THUNK.setBestFaqt(faqtId)),
    onActivate     : faqtId => dispatch(THUNK.activateFaqt(faqtId)), 
    onLogout       : () => dispatch(THUNK.logout()),
    onLogin        : (email,password) => dispatch(THUNK.login(email, password)),
    onSignup       : (email,password) => dispatch(THUNK.signup(email, password)),
    onSearchChange : function(search)  {
      // dispatch(updateActiveSearch(search))
    }
  }
}

const appContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default appContainer

