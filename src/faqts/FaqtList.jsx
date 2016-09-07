import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as SELECT from '../select'
import * as THUNK from '../thunks'
import {COL0WIDTH} from '../constants'
import Faqt from './faqt/faqt-container'

const s1 = { paddingLeft:COL0WIDTH, overflowY:'auto' }
const s2 = { paddingTop: 10, width:600 }

function mapStateToProps(state, ownProps) {
  const { faqId } = ownProps
  const { search } = state.ui
  const faqtIds = SELECT.getFaqtIds(state, faqId, search)
  return { faqId, faqtIds }
}

function mapDispatchToProps(dispatch, ownProps) {
  return { }
}

const FaqtList = ({faqId, faqtIds}) => {
  return <div id='faqtsContainer' style={s1}>
    <div style={s2}>
      {
        faqtIds.map(id => <Faqt key={id} faqId={faqId} faqtId={id} />)
      }
    </div>
  </div>
}
export default connect(mapStateToProps, mapDispatchToProps)(FaqtList)
