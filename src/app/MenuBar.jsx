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
  textAlign:'right',
  display:'flex'
}
const S3A = { flex:1, textAlign:'left' }
const S3B = { flex:1, textAlign:'right'}

const MenuBar = ({search, faqrefs, dispatch}) => {
  const onAddFaqt = e => {
    e.preventDefault()
    dispatch(THUNK.addFaqt(search))
  }
  const onCleanUp = e => {
    e.preventDefault()
    dispatch(THUNK.cleanUp())
  }
  const setFaq = (e, faqref) => {
    e.preventDefault()
    dispatch(THUNK.setActiveFaq(faqref))
  }
  return <div style={S0}>
    <div id='toolbar' style={S1}>
      <div style={S2}>
        <div style={S3A}>
        {
           faqrefs.map(faqref => {
             const {uid,faqId} = faqref
             const key = `${uid}-${faqId}`
             return <button key={key} onClick={e => setFaq(e, faqref)}>{faqId}</button>
           })
        }
        </div>
        <div style={S3B}>
          <button key={'cleanUp'} onClick={onCleanUp}>Clean Up</button>
          <button key={'addFaqt'} onClick={onAddFaqt}>Add Faqt</button>
        </div>
      </div>
    </div>
  </div>
}

const mapStateToProps = ({faqs, ui:{uid, faqref, search}}) => {
  return { faqref, search, faqrefs:faqs } 
}
export default connect(mapStateToProps)(MenuBar)




