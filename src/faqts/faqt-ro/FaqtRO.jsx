import React, { Component } from 'react';
import { connect } from 'react-redux'
import MyEditor from './Editor'
import * as SELECT from '../../select'
import * as THUNK from '../../thunks'

const S0 = {marginBottom:5, padding:1}
const style0 = {
  backgroundColor:'azure',
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

const ScoreButton = (faqtKey, isLinked, dispatch) => {
  if(!isLinked) return null
  const onClick = e => {
    e.preventDefault()
    dispatch(THUNK.deleteScore(faqtKey))
  }
  return <button onClick={onClick}>XXX</button>
}

const FaqtRO = ({faqtKey, text, draftjs, isLinked, isActive, dispatch})  => {
  const style = isActive ? Object.assign({},style0A,BEIGE) : style0A;
  const onSetBest = () => dispatch(THUNK.setBestFaqtByKey(faqtKey))
  return 
  <div style={S0}>
    <div style={style0}>
      <div style={style}>
        <MyEditor {...{text, draftjs}} />
      </div>
      <div style={{display:'flex', flexDirection:'column'}}>
        <button onClick={e => onSetBest(e)}>best</button>
        <ScoreButton {...{faqtKey, isLinked, dispatch}} />
      </div>
    </div>
  </div>
}

function mapStateToProps(state, ownProps) {
  const { faqtKey } = ownProps
  const { ui, faqts } = state
  const { draftjs, text } =  faqts.get(faqtKey)
  const isActive = faqtKey === ui.faqtKey
  const faqt = faqts.get(faqtKey)
  const search = ui.search || {} 
  const isLinked = search.scores ? search.scores.includes(faqtKey) : false 
  return { draftjs, text, isLinked, isActive }
}

export default connect(mapStateToProps)(FaqtRO)

