import React, { Component } from 'react';
import { connect } from 'react-redux'
import {isEqual} from 'lodash'
import * as THUNK  from '../thunks'

import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'

const S1 = { flex:1, textAlign:'left' }
const S2 = { display:'inline'}

function AddFaqtMenuItem({isRO, faqref, dispatch}) {
  if(isRO) return null
  return <MenuItem eventKey="4" onClick={e => dispatch(THUNK.addFaqt(faqref))}>Add Faqt</MenuItem>
}

function FaqBar({faqs, dispatch}) {
  return <ButtonToolbar style={S1}>{
    faqs.map(faq => {
      const {uid,faqId, isRO} = faq
      const key = `${uid}-${faqId}`
      const faqref = {uid, faqId}
      const style = isRO ? 'default' : 'info'
      return <DropdownButton bsStyle={style} id={key} key={key} title={faqId}>
        <MenuItem eventKey="1" onClick={e => dispatch(THUNK.closeFaq(faqref))}>Close</MenuItem>
        <AddFaqtMenuItem {...{isRO, faqref, dispatch}} />
      </DropdownButton>
    })
  }
  </ButtonToolbar>
}
export default connect(({faqs}) => ({ faqs }))(FaqBar)

