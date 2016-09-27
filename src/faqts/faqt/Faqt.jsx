import React, { Component } from 'react';
import { connect } from 'react-redux'
import MyEditor from './Editor'
import TagsEditor from './TagsEditor'
import ScoreButton from '../ScoreButton'
import * as SELECT from '../../select'
import * as THUNK from '../../thunks'

const S0 = {backgroundColor:'paleblue',marginBottom:5, padding:1}
const style0 = {
  backgroundColor:'white',
  display:'flex',
  paddingTop: 5,
  paddingBottom: 5,
  borderBottom: 'lightgrey 1px solid'
}
const style0A = {
  flex:1,
  minWidth:0,
  marginRight: 5,
  overflowX: 'auto',
  maxHeight:'15vh',
  overflowY:'auto'
}
const BEIGE = {
  maxHeight : '50vh'
}

const Faqt = ({faqt, isActive, score, dispatch})  => {
  const {faqref, faqtId, text, draftjs, tags} = faqt
  const onFocus = e => faqt.faqref.isRO ? null : dispatch(THUNK.activateFaqt(faqt))
  const onSave = (text, draftjs, nextFocus) => dispatch(THUNK.updateFaqt(faqt, text, draftjs, nextFocus))
  const onSetBest = () => dispatch(THUNK.setBestFaqt(faqt))
  const style = isActive ? Object.assign({},style0A,BEIGE) : style0A
  const onEditClick = e => {
    if(!isActive) dispatch(THUNK.activateFaqt(faqt))
  }
  if(faqref.isRO) console.log('showing an RO FAQT!!!!')
  return <div style={S0}>
    <div style={style0}>
      <div style={style} onFocus={onFocus}>
        <MyEditor {...{text, isActive, draftjs, onSave, onClick:onEditClick}} />
      </div>
      <div style={{display:'flex', flexDirection:'column'}}>
        <button onClick={e => onSetBest(e)}>best</button>
        <ScoreButton {...{score}} />
      </div>
    </div>
    <TagsEditor {...{faqt}} />
  </div>
}

function mapStateToProps(state, ownProps) {
  const { faqt } = ownProps
  const isActive = faqt.id === SELECT.getActiveFaqtId(state)
  const search = SELECT.getActiveSearch(state)
  const score = search ? SELECT.findScore(state, search, faqt) : null
  return { faqt, isActive, score }
}

export default connect(mapStateToProps)(Faqt)



