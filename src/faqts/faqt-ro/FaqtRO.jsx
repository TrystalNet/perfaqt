import React, { Component } from 'react';
import { connect } from 'react-redux'
import MyEditor from './Editor'
import ScoreButton from '../ScoreButton'
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

const FaqtRO = ({faqt, isActive, score, dispatch})  => {
  const {faqref, faqtId, text, draftjs, tags} = faqt
  const style = isActive ? Object.assign({},style0A,BEIGE) : style0A;
  const onSetBest = () => dispatch(THUNK.setBestFaqt(faqt))
  return <div style={S0}>
    <div style={style0}>
      <div style={style}>
        <MyEditor {...{text, draftjs}} />
      </div>
      <div style={{display:'flex', flexDirection:'column'}}>
        <button onClick={e => onSetBest(e)}>best</button>
        <ScoreButton {...{score}} />
      </div>
    </div>
  </div>
}

function mapStateToProps(state, ownProps) {
  const { faqt } = ownProps
  const isActive = faqt.id === SELECT.getActiveFaqtId(state)
  const search = SELECT.getActiveSearch(state)
  const score = search ? SELECT.findScore(state, faqt, search) : null
  return { faqt, isActive, score }
}

export default connect(mapStateToProps)(FaqtRO)



