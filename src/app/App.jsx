import React, { Component } from 'react';
import { connect } from 'react-redux'

import SearchBar from '../searchbar/searchbar-container'
import FaqtList from '../faqts/FaqtList'
import MenuBar   from './MenuBar'
import LoginPage from './LoginPage'
import * as THUNK  from '../thunks'

function mapStateToProps(state) {
  const { connected, faqId } = state.ui
  return { connected, faqId }
}
function mapDispatchToProps(dispatch) {
  return {
    onAddFaqt      : () => dispatch(THUNK.addFaqt()),
    onLogin        : (email,password) => dispatch(THUNK.login(email, password)),
    onSignup       : (email,password) => dispatch(THUNK.signup(email, password))
  }
}
class App extends Component {
  render() {
    const { faqId, connected } = this.props
    const { onAddFaqt, onLogin, onSignup } = this.props
    if(!connected) return (<LoginPage {...{onLogin, onSignup}} />)
    return (
      <div id='app'>
        <SearchBar />
        <MenuBar   {...{ onAddFaqt }}/>
        <FaqtList faqId={faqId} />
      </div>
    )
  }
}

const appContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default appContainer

