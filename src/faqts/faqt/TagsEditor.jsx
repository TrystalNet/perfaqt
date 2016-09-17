import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as SELECT from '../../select'
import * as THUNK from '../../thunks'
import { updateUI } from '../../reducer'

const S1 = { display:'flex', border:'black 0px solid', backgroundColor:'lightgrey', padding:5, paddingRight:6 }
const S2 = {flex:0, margin:3, marginRight:8}
const S3 = {flex:1, border: 'red 0px solid', paddingLeft:5}

const TagsEditor = ({isActive, value, faqt, dispatch}) => {
  if(!isActive) return null
  const onFocus = e => dispatch(THUNK.setActiveField({fldName:'fldTags', objectId:faqt.id}))
  const handleChange = e => {
    e.preventDefault()
    dispatch(THUNK.updateActiveField(e.target.value))
  }
  const onKeyDown = e => {
    if(e.keyCode !== 13) return
    e.preventDefault()
    dispatch(THUNK.saveActiveField())
  }
  return <div style={S1}>
    <div style={S2}><b>Tags:</b></div>
    <input 
      type='text' 
      value={value || ''} 
      onChange={handleChange}
      onKeyDown={onKeyDown} 
      onFocus={onFocus}
      style={S3}/>
  </div>
}
const mapStateToProps = (state, {faqt}) => {
  const {ui:{faqtId, activeField}} = state
  const isActive = faqtId === faqt.id
  const isHot = isActive && activeField.fldName === 'fldTags' && activeField.objectId === faqtId 
  const value = isHot ? activeField.tmpValue : faqt.tags
  return {isActive, faqt, value}
}
export default connect(mapStateToProps)(TagsEditor)