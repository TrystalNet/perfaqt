import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as SELECT from '../../select'
import * as THUNK from '../../thunks'
import Faqt from './faqt' 

function mapStateToProps(state, ownProps) {
  const { faqtId } = ownProps
  const { text, draftjs, tags } = SELECT.getFaqtById(state, faqtId)
  const isActive  = faqtId === state.ui.faqtId
  const focusedControl   = isActive ? state.ui.focused : null 
  const search = SELECT.getSearch(state)
  const score = search ? SELECT.findScore(state, state.ui.faqId, search.id, faqtId) : null
  return { isActive, focusedControl, text, draftjs, tags, score }
}

function mapDispatchToProps(dispatch, ownProps) {
  const { faqtId } = ownProps
  return { 
    onSave:         (text, draftjs, nextFocus) => dispatch(THUNK.updateFaqt(faqtId, text, draftjs, nextFocus)),
    onSaveTags:     tags => dispatch(THUNK.updateTags(faqtId, tags)),
    onActivate:     () => dispatch(THUNK.activateFaqt(faqtId)),
    onSetBest:      () => dispatch(THUNK.setBestFaqt(faqtId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Faqt)
