import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as SELECT from '../../select'
import * as THUNK from '../../thunks'
import Faqt from './faqt' 

function mapStateToProps(state, ownProps) {
  const { faqId, faqtId } = ownProps
  const { focused } = state.ui
  const { text, draftjs, tags } = SELECT.getFaqtById(state, faqId, faqtId)
  const isActive = ((faqId === state.ui.faqId) && (faqtId === state.ui.faqtId))
  const focusedControl = isActive ? focused : null 
  const search = SELECT.getSearch(state)
  const score = search ? SELECT.findScore(state, faqId, search.id, faqtId) : null
  return { isActive, focusedControl, text, draftjs, tags, score }
}

function mapDispatchToProps(dispatch, ownProps) {
  const { faqId, faqtId } = ownProps
  return { 
    onSave:         (text, draftjs, nextFocus) => dispatch(THUNK.updateFaqt(faqId, faqtId, text, draftjs, nextFocus)),
    onSaveTags:     tags => dispatch(THUNK.updateTags(faqId, faqtId, tags)),
    onActivate:     () => dispatch(THUNK.activateFaqt(faqId, faqtId)),
    onSetBest:      () => dispatch(THUNK.setBestFaqt(faqId, faqtId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Faqt)
