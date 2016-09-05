import { connect } from 'react-redux'
import SearchBar from './SearchBar'
import * as THUNK  from '../thunks'
import * as SELECT from '../select'

function mapStateToProps(state) {
  const { broadcast, connected, focused, search  } = state.ui
  const searches = SELECT.searches(state)
  const isFocus = focused === 'SEARCH'
  return { searches, search, broadcast, connected, isFocus }
}

function mapDispatchToProps(dispatch) {
  return {
    onAsk          : text => dispatch(THUNK.doSearch(text)),
    onSaveSearch   : text => dispatch(THUNK.saveSearch(text)),
    onGotFocus     : () => dispatch(THUNK.focusSearch())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)

