import React, { Component } from 'react';
import {COL0WIDTH} from '../constants'
import Faqt from './faqt/faqt-container'

const s1 = { paddingLeft:COL0WIDTH, overflowY:'auto' }
const s2 = { paddingTop: 10, width:600 }

const FaqtsArea = ({faqts}) => {
  return <div id='faqtsContainer' style={s1}>
    <div style={s2}>
      {
        faqts.map(faqt => <Faqt key={faqt.id} faqtId={faqt.id} />)
      }
    </div>
  </div>
}
export default FaqtsArea
