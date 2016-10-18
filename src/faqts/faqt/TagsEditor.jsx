import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as TMPFIELD from '../../tmpField'

const S1 = { display:'flex', border:'black 0px solid', backgroundColor:'lightgrey', padding:5, paddingRight:6 }
const S2 = { flex:0, margin:3, marginRight:8 }
const S3 = { flex:1, border: 'red 0px solid', paddingLeft:5 }

const TagsEditor = ({faqtKey, isActive, tags, dispatch}) => {
  if(!isActive) return null
  const onFocus = e => dispatch(TMPFIELD.setActiveField({fldName:'fldTags', objectId:faqtKey}))
  const handleChange = e => {
    e.preventDefault()
    dispatch(TMPFIELD.updateActiveField(e.target.value))
  }
  const onKeyDown = e => {
    if(e.keyCode !== 13) return
    e.preventDefault()
    dispatch(TMPFIELD.saveActiveField())
  }
  return <div style={S1}>
    <div style={S2}><b>Tags:</b></div>
    <input 
      type='text' 
      style={S3}
      value={tags} 
      onChange={handleChange}
      onKeyDown={onKeyDown} 
      onFocus={onFocus} />
  </div>
}
const mapStateToProps = (state, {faqtKey}) => {
  const {faqts, ui, ui:{activeField:{fldName, objectId, tmpValue}}} = state
  const isActive = faqtKey === ui.faqtKey
  const isHot = isActive && fldName === 'fldTags' && objectId === faqtKey 
  const tags = (isHot ? tmpValue : faqts.get(faqtKey).tags) || ''
  return {isActive, tags}
}
export default connect(mapStateToProps)(TagsEditor)