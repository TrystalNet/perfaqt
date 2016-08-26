import { connect } from 'react-redux'
import App from './App'
import * as THUNK  from '../thunks'
import * as SELECT from '../select'
// import * as UI     from '../ui/ui-actions'

function mapStateToProps(state) {
  const faqtId = state.ui.faqtId
  const search = state.ui.search || ''
  const faqts = SELECT.rankedFaqts(state, search)
  const searches = SELECT.searches(state)
  return {
    faqtId,
    faqts,
    searches,
    search,
    isDirty:state.ui.isDirty
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onAddFaqt:       () => dispatch(THUNK.addFaqt()),
    onLoad:          () => dispatch(THUNK.load()),
    onSave:          () => dispatch(THUNK.save()),
    onAsk:           search => dispatch(THUNK.doSearch(search)),
    onSaveSearch:    search => dispatch(THUNK.saveSearch(search)),
    onUpdateFaqt:    (faqtId, text) => dispatch(THUNK.updateFaqt(faqtId, text)),
    onSetBestFaqt:   faqtId => dispatch(THUNK.setBestFaqt(faqtId)),
    onActivate     : faqtId => dispatch(THUNK.activateFaqt(faqtId)), 
    onSearchChange: function(search)  {
      // dispatch(updateActiveSearch(search))
    }
  }
}

const appContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default appContainer

