import React, { Component } from 'react';
import {COL0WIDTH} from '../constants'
import Faqt from './Faqt'

const s2 = { paddingTop: 10, width:600 }

const containerStyle = {
  paddingLeft:COL0WIDTH,
  overflowY:'auto'
}

const piggycontainerStyle = {
  paddingLeft:COL0WIDTH,
  overflowY:'auto',
  border:'red 1px solid'
}

// const EditFaqt = ({faqtId}) => {
//   return <div id='faqtsContainer' style={piggycontainerStyle}>
//     <div style={s2}><Faqt key={faqtId} faqtId={faqtId} /></div>
//   </div>
// }

const FaqtsArea = ({faqts, faqtId}) => {
  // if(faqtId) return <EditFaqt faqtId={faqtId} />
  return <div id='faqtsContainer' style={containerStyle}>
    <div style={s2}>
      {
        faqts.map(faqt => <Faqt key={faqt.id} faqtId={faqt.id} />)
      }
    </div>
  </div>
}
export default FaqtsArea
