import React, { Component } from 'react';
import { connect } from 'react-redux'
import {isEqual} from 'lodash'
import * as THUNK  from '../thunks'

const S1 = { flex:1, textAlign:'left' }
const S2 = { display:'inline'}

function FaqBar({faqref, faqs, dispatch}) {
  console.log(faqref)
  return <div style={S1}>{
    faqs.map(fr => {
      const key = `${fr.uid}-${fr.faqId}` 
      if(isEqual(fr,faqref)) return <div key={key} style={S2}>{fr.faqId}</div> 
      return <button key={key} onClick={e => dispatch(THUNK.setActiveFaq(fr))}>{fr.faqId}</button>
    })
  }
  </div>
}
export default connect(({ui:{faqref}, faqs}) => ({ faqref, faqs }))(FaqBar)

