import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as SELECT from '../select'
import * as THUNK from '../thunks'
import {COL0WIDTH} from '../constants'
import Faqt from './faqt/Faqt'
import FaqtRO from './faqt-ro/FaqtRO'

const s1 = { paddingLeft:COL0WIDTH, overflowY:'auto' }
const s2 = { paddingTop: 10, width:600 }

// VERSIONS OF FAQTS TO POSSIBLY SHOW
// 1. READONLY, NOTACTIVE
// 2. READONLY, ACTIVE
// 3. READWRITE, NOTACTIVE
// 4. READWRITE, ACTIVE, NOT EDITING
// 5. READWRITE, ACTIVE, EDITING

const getVersion = ({faqref, id}) => {
  if(faqref.isRO) return 'RO'
  return 'RW'
}


const FaqtList = ({faqts}) => <div id='faqtsContainer' style={s1}>
  <div style={s2}>{ 
    faqts.map(faqt => {
      switch(getVersion(faqt)) {
        case 'RW': return <Faqt key={faqt.id} faqt={faqt} />
      }
      return <FaqtRO key={faqt.id} faqt={faqt} />
    })
  }
  </div>
</div>

const mapStateToProps = state => ({faqts:SELECT.getFaqtsForSearch(state, state.ui.search)})
export default connect(mapStateToProps)(FaqtList)
