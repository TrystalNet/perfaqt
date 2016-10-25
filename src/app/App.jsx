import React, { Component } from 'react';
import { connect } from 'react-redux'
import {ButtonToolbar} from 'react-bootstrap'

import LoginPage from '../login/LoginPage'
import SearchBar from '../searchbar/SearchBar'
import FaqtList from '../faqts/FaqtList'

import FaqButton from './FaqButton'
import CFaqButton from './CFaqButton'

import * as THUNK  from '../thunks'

const faqToKey = ({uid, faqId}) => `${uid}/${faqId}`
const s1 = {padding:5}

const App = ({uid, faqs, cfaqs}) => {
  if(!uid) return <LoginPage />
  return <div id='app'>
    <SearchBar />
    <ButtonToolbar style={s1}>{ faqs.map( faq => <FaqButton  key={faqToKey(faq)} faq={faq} />)}</ButtonToolbar>
    <ButtonToolbar style={s1}>{cfaqs.map(cfaq => <CFaqButton key={faqToKey(cfaq)} faqref={cfaq} />)}</ButtonToolbar>
    <FaqtList />
  </div>
}

const mapStateToProps = ({ui:{uid}, faqs, cfaqs}) => { 
  return ({uid, faqs, cfaqs}) 
} 
export default connect(mapStateToProps)(App)














