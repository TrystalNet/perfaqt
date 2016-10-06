import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as SELECT from '../select'
import {COL0WIDTH} from '../constants'
import Faqt from './faqt/Faqt'
import FaqtRO from './faqt-ro/FaqtRO'

const s1 = { paddingLeft:COL0WIDTH, overflowY:'auto' }
const s2 = { paddingTop: 10, width:600 }

const FaqtList = ({faqtKeys}) => <div id='faqtsContainer' style={s1}>
  <div style={s2}>
    { 
      faqtKeys.map(faqtKey => <Faqt key={faqtKey} faqtKey={faqtKey} />) 
    }
  </div>
</div>

const mapStateToProps = state => {
  const faqtKeys = SELECT.getFaqtKeysForSearch(state)
  // const isRO = faqtKeys.map(faqtKey => SELECT.IsRO(faqtKey)) 
  return { faqtKeys }
}
export default connect(mapStateToProps)(FaqtList)
