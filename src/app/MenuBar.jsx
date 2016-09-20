import React, { Component } from 'react';
import { connect } from 'react-redux'
import { COL0WIDTH} from '../constants'
import * as THUNK  from '../thunks'
import FaqBar from './FaqBar'

const S0 = { paddingLeft: COL0WIDTH }
const S1 = {
  height:40,
  borderBottom: 'lightgray 1px solid',
  width:600,
  display:'flex'
}
const S2 = {
  flex:1,
  textAlign:'right',
  display:'flex'
}
const S3A = { flex:1, textAlign:'left' }
const S3B = { flex:1, textAlign:'right'}

function ButtonBar({dispatch, faqref, search}) {
  if(!faqref || faqref.isRO) return null
  return <div style={S3B}>
    <button key={'cleanUp'} onClick={e=>dispatch(THUNK.cleanUp())}>Clean Up</button>
    <button key={'addFaqt'} onClick={e=>dispatch(THUNK.addFaqt(search))}>Add Faqt</button>
  </div>
}

const MenuBar = ({search, faqref, faqrefs, dispatch}) => {
  return <div style={S0}>
    <div id='toolbar' style={S1}>
      <div style={S2}>
        <FaqBar />
        <ButtonBar {...{dispatch, faqref, search}}/>
      </div>
    </div>
  </div>
}

const mapStateToProps = ({faqs, ui:{uid, faqref, search}}) => {
  return { search, faqref, faqrefs:faqs } 
}
export default connect(mapStateToProps)(MenuBar)
