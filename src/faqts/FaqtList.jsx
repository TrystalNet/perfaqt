import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as SELECT from '../select'
import * as THUNK from '../thunks'
import {COL0WIDTH} from '../constants'
import Faqt from './faqt/Faqt'
import FaqtRO from './faqt-ro/FaqtRO'

const s1 = { paddingLeft:COL0WIDTH, overflowY:'auto' }
const s2 = { paddingTop: 10, width:600 }

// VERSIONS OF FAQTS TO POSSIBLY SHOW
// 1. READONLY, NOTACTIVE
// 2. READONLY, ACTIVE
// 3. READWRITE, NOTACTIVE
// 4. READWRITE, ACTIVE, NOT EDITING
// 5. READWRITE, ACTIVE, EDITING

const getVersion = ({faqref, id}) => {
  if(faqref.isRO) return 'RO'
  return 'RW'
}


const FaqtList = ({faqts}) => <div id='faqtsContainer' style={s1}>
  <div style={s2}>{ 
    faqts.map(faqt => {
      switch(getVersion(faqt)) {
        case 'RW': return <Faqt key={faqt.id} faqt={faqt} />
      }
      return <FaqtRO key={faqt.id} faqt={faqt} />
    })
  }
  </div>
</div>

const mapStateToProps = state => {
  // connect has the responsibility to scan for state changes
  // seems like the searchId (or null) could be passed as a property to this control
  // if that doesn't change, then it should short-circuit the process
  // ----- but the question is --- how could we change this code so that it does the same short circuiting_
  // input is state
  // this is going to subscribe to the fact that state has changed
  // when the state has changed, it is going to recaluate some additional state, to be passed down to the Component
  // if that state hasn't changed, then the component update will be skipped
  //
  // the code below doesn't work because getFaqtsForSearch returns a new collection every time, even if nothing has 
  // changed; so it always looks different to the control
  // but wait; is this really true? if the new faqt collection has the same faqts, in the same order as the 
  // old collection, does the fact that refs are different matter? yes; this is the whole point of immutability
  // ----
  // so what really needs to happen is that getFaqtsForSearch has to return the same faqt collection that is alrady
  // there, and the only way to do that is to keep them around
  // time to go back and review how the todolist works; it is filtering vs sorting, but still relevant perhaps 


  return {faqts:SELECT.getFaqtsForSearch(state, state.ui.search)}
}
export default connect(mapStateToProps)(FaqtList)
