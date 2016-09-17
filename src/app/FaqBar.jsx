import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as THUNK  from '../thunks'

const S1 = { flex:1, textAlign:'left' }

function FaqBar({faqs, dispatch}) {
  return <div style={S1}>{
    faqs.map(faqref => 
      <button 
        key={`${faqref.uid}-${faqref.faqId}`}
        onClick={e => dispatch(THUNK.setActiveFaq(faqref))}>
      {faqref.faqId}
      </button>)
  }
  </div>
}
export default connect(({faqs}) => ({ faqs }))(FaqBar)

