import React, { Component } from 'react';
import { connect } from 'react-redux'
import MyEditor from './Editor'
import TagsEditor from './TagsEditor'
import * as SELECT from '../../select'
import * as THUNK from '../../thunks'

// VERSIONS OF FAQTS TO POSSIBLY SHOW
// 1. READONLY, NOTACTIVE
// 2. READONLY, ACTIVE
// 3. READWRITE, NOTACTIVE
// 4. READWRITE, ACTIVE, NOT EDITING
// 5. READWRITE, ACTIVE, EDITING


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
const ScoreButton = ({isLinked, onDeleteScore}) => {
  if(!isLinked) return null
  const onClick = e => {
    e.preventDefault()
    onDeleteScore()
  }
  return <button onClick={onClick}>XXX</button>
}

const Faqt = ({
  faqtKey, 
  isRO, text, draftjs, isLinked, isActive,
  onFocus, onSave, onSetBest, onEditClick, onDeleteScore
  })  => {
  const style = isActive ? Object.assign({},style0A,BEIGE) : style0A
  return <div style={S0}>
    <div style={style0}>
      <div style={style} onFocus={e => onFocus(isRO)}>
        <MyEditor {...{text, isActive, draftjs, onSave, onClick:onEditClick}} />
      </div>
      <div style={{display:'flex', flexDirection:'column'}}>
        <button onClick={onSetBest}>best</button>
        <ScoreButton {...{isLinked, onDeleteScore}} />
      </div>
    </div>
    <TagsEditor {...{faqtKey}} />
  </div>
}



function mapDispatchToProps(dispatch, {faqtKey}) {
  const onSave = (text, draftjs, nextFocus) => dispatch(THUNK.updateFaqt(faqtKey, text, draftjs, nextFocus))
  const onSetBest = () => dispatch(THUNK.setBestFaqtByKey(faqtKey))
  const onDeleteScore = () => dispatch(THUNK.deleteScore(faqtKey))

  const onEditClick = () => {
    console.log('using onEditClick to actiate the faqt')
    return dispatch(THUNK.activateFaqt(faqtKey))
  }
  const onFocus = () => {
    console.log('using onFocus to activate the faqt')
    dispatch(THUNK.activateFaqt(faqtKey))
  }
  return { onFocus, onEditClick, onSave, onSetBest, onDeleteScore }  
}

function mapStateToProps(state, ownProps) {
  const { faqtKey } = ownProps
  const { ui, faqts } = state
  const { faqref:{isRO}, text, draftjs } = faqts.get(faqtKey)
  const isActive = faqtKey === ui.faqtKey
  const search = ui.search || {}
  const isLinked = search.scores ? search.scores.includes(faqtKey) : false
  return { isRO, text, draftjs, isLinked, isActive }
}

export default connect(mapStateToProps, mapDispatchToProps)(Faqt)



