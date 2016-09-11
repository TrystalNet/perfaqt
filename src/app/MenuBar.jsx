import React, { Component } from 'react';
import { connect } from 'react-redux'
import { COL0WIDTH} from '../constants'
import * as THUNK  from '../thunks'

const S0 = { paddingLeft: COL0WIDTH }
const S1 = {
  height:40,
  borderBottom: 'lightgray 1px solid',
  width:600,
  display:'flex'
}
const S2 = {
  flex:1,
  textAlign:'right'
}

const MenuBar = ({faqref, searches, scores, dispatch}) => {
  const onAddFaqt = e => {
    e.preventDefault()
    dispatch(THUNK.addFaqt(faqref))
  }
  const onCleanUp = e => {
    e.preventDefault()
    dispatch(THUNK.cleanUp())
  }
  return <div style={S0}>
    <div id='toolbar' style={S1}>
      <div style={S2}>
        <button onClick={onCleanUp}>Clean Up</button>
        <button onClick={onAddFaqt}>Add Faqt</button>
      </div>
    </div>
  </div>
}

const mapStateToProps = ({ui:{faqref}}) => ({ faqref })
export default connect(mapStateToProps)(MenuBar)
