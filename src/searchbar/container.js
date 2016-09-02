import { connect } from 'react-redux'
import SearchBar from './SearchBar'
import * as THUNK  from '../thunks'
import * as SELECT from '../select'

function mapStateToProps(state) {
  const { broadcast, connected, faqtId } = state.ui
  const search = state.ui.search || ''
  const searches = SELECT.searches(state)
  const isFocus = faqtId === '__search'
  return { searches, search, broadcast, connected, isFocus }
}

function mapDispatchToProps(dispatch) {
  return {
    onAsk          : search => dispatch(THUNK.doSearch(search)),
    onSaveSearch   : search => dispatch(THUNK.saveSearch(search)),
    onGotFocus     : () => dispatch(THUNK.activateFaqt(null)),
    onSearchChange : function(search)  {
      // dispatch(updateActiveSearch(search))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)

