import React, { Component } from 'react';
import { connect } from 'react-redux'

import SearchBar from '../searchbar/SearchBar'
import FaqtList from '../faqts/FaqtList'
import LoginPage from '../login/LoginPage'
import MenuBar   from './MenuBar'
import * as THUNK  from '../thunks'

const App = ({uid}) => {
  if(!uid) return <LoginPage />
  return <div id='app'>
    <SearchBar />
    <MenuBar />
    <FaqtList />
  </div>
}

const mapStateToProps = ({ui:{uid}}) => ({uid}) 
export default connect(mapStateToProps)(App)
