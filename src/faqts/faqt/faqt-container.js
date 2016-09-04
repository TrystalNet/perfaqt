import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as SELECT from '../../select'
import * as THUNK from '../../thunks'
import Faqt from './faqt' 

function mapStateToProps(state, ownProps) {
  const { faqtId } = ownProps
  const { text, draftjs } = SELECT.getFaqtById(state, faqtId)
  let tags = 'yes, no, maybe'
  if(text.length < 100) tags = ''
  const isActive  = faqtId === state.ui.faqtId
  const focusedControl   = isActive ? state.ui.focused : null 
  return { isActive, focusedControl, text, draftjs, tags }
}

function mapDispatchToProps(dispatch, ownProps) {
  const { faqtId } = ownProps
  return { 
    onSave:         (text, draftjs, nextFocus) => dispatch(THUNK.updateFaqt(faqtId, text, draftjs, nextFocus)),
    onActivate:     () => dispatch(THUNK.activateFaqt(faqtId)),
    onSetBest:      () => dispatch(THUNK.setBestFaqt(faqtId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Faqt)
