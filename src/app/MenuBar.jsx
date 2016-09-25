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

// what happens when the result of a user action is a faqt in a different faq
// we should jump to that faq; ok, but search results cross faqs
// to display them in a composite list, there would have to be multiple faqs participating in the list
// so has all of this been for nothing? -- no, user still gets to make their own decision
// the whole point of this was not to have to remember where a faqt was in order to search for it
// so the merged list is a requirement;
// adding items happens in the hot faqt;
// what does a link do? 
// open a whole faqt?
//
// it has to be possible to 'visit' a faq
//
// could a faqt simply be a link to faqt somewhere else?
// ... such a faqt would display the original;
// ... the faqt would be included in my own searchable faq content
// ... how would 
//
// the conflict....
// 
// a search should search everything; and allow the user to decide what to do with the results
// true to the google metaphor, the results have to be able to come from anywhere
// that means some of the results are editable, while others are not
// it also means that we have to decide where a new faqt should google
// which is wright back to where we are now....
// perhaps when there is no search, we fall back to only showing faqts from the main faqct system;
// not bad;
// but that really isn't the issue here
// still remains though, what does it mean to link to another faq?
// 

function ButtonBar({dispatch, faqref}) {
  if(!faqref || faqref.isRO) return null
  return <div style={S3B}>
    <button key={'addFaqt'} onClick={e=>dispatch(THUNK.addFaqt())}>Add Faqt</button>
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
