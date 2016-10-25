import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Button, ButtonToolbar} from 'react-bootstrap'

import LoginPage from '../login/LoginPage'
import SearchBar from '../searchbar/SearchBar'
import FaqtList  from '../faqts/FaqtList'
import FaqPage   from './FaqPage'

import FaqButton  from './FaqButton'
import CFaqButton from './CFaqButton'

import * as THUNK  from '../thunks'
import {updateUI} from '../reducers/reducer-ui'

const faqToKey = ({uid, faqId}) => `${uid}/${faqId}`
const s1 = {padding:5}


const PageContainer = ({which, dispatch}) => {
  switch(which) {
    case 'faq': return <FaqPage />
    default: return <FaqtList />
  }
}


const App = ({uid, page, faqs, cfaqs, dispatch}) => {
  if(!uid) return <LoginPage />
  return <div id='app'>
    <SearchBar />
    <ButtonToolbar style={s1}>
      <Button onClick={()=>dispatch(THUNK.showFaqDialog())}>NEW</Button>
      { faqs.map( faq => <FaqButton  key={faqToKey(faq)} faq={faq} />)}
    </ButtonToolbar>
    <ButtonToolbar style={s1}>{cfaqs.map(cfaq => <CFaqButton key={faqToKey(cfaq)} faqref={cfaq} />)}</ButtonToolbar>
    <PageContainer which={page} dispatch={dispatch}/>
  </div>
}

const mapStateToProps = ({ui:{uid, page}, faqs, cfaqs}) => { 
  return ({uid, page, faqs, cfaqs}) 
} 
export default connect(mapStateToProps)(App)














