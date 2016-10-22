import React, { Component } from 'react';
import { connect } from 'react-redux'

import LoginPage from '../login/LoginPage'

import SearchBar from '../searchbar/SearchBar'
import {ButtonToolbar} from 'react-bootstrap'
import FaqButton from './FaqButton'
import FaqtList from '../faqts/FaqtList'

import * as THUNK  from '../thunks'

const faqToKey = ({uid, faqId}) => `${uid}/${faqId}` 

const App = ({uid, faqs}) => {
  if(!uid) return <LoginPage />
  return <div id='app'>
    <SearchBar />
    <ButtonToolbar style={{padding:5}}>{faqs.map(faq => <FaqButton key={faqToKey(faq)} faq={faq} />)}</ButtonToolbar>
    <FaqtList />
  </div>
}

const mapStateToProps = ({ui:{uid}, faqs}) => ({uid, faqs}) 
export default connect(mapStateToProps)(App)
