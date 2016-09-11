import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as SELECT from '../select'
import * as THUNK from '../thunks'
import {COL0WIDTH} from '../constants'
import Faqt from './faqt/Faqt'

const s1 = { paddingLeft:COL0WIDTH, overflowY:'auto' }
const s2 = { paddingTop: 10, width:600 }

const FaqtList = ({faqts}) => <div id='faqtsContainer' style={s1}>
  <div style={s2}>
    { faqts.map(faqt => <Faqt key={faqt.id} faqt={faqt} />) }
  </div>
</div>

const mapStateToProps = state => ({faqts:SELECT.getFaqtsForSearch(state, state.ui.search)})
export default connect(mapStateToProps)(FaqtList)
