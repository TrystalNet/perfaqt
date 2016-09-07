import { connect } from 'react-redux'
import SearchBar from './SearchBar'
import * as THUNK  from '../thunks'
import * as SELECT from '../select'

function mapStateToProps(state) {
  const { broadcast, connected, focused, search, faqId  } = state.ui
  const searches = SELECT.searches(state, faqId).filter(search => search.faqId === faqId)
  const isFocus = focused === 'SEARCH'
  return { searches, search, broadcast, connected, isFocus }
}

function mapDispatchToProps(dispatch) {
  return {
    onSearchChange : text => dispatch(THUNK.setSearch(text)),
    onSaveSearch   : text => dispatch(THUNK.saveSearch(text)),
    onGotFocus     : () => dispatch(THUNK.focusSearch())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)

