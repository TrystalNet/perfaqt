import { connect } from 'react-redux'
import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap'

import * as THUNK  from '../thunks'

function AddFaqtMenuItem({isRO, faqref, dispatch}) {
  if(isRO) return null
  return <MenuItem eventKey="4" onClick={e => dispatch(THUNK.addFaqt(faqref))}>Add Faqt</MenuItem>
}

function onDrop(e) {
  const data = e.dataTransfer.getData('text');
  e.preventDefault()
  e.stopPropagation()
}

function FaqButton({faq, dispatch}) {
  const {uid,faqId, isRO} = faq
  const key = `${uid}-${faqId}`
  const faqref = {uid, faqId}
  const style = isRO ? 'default' : 'info'
  return <DropdownButton bsStyle={style} id={key} key={key} title={faqId} onDragOver={e => e.preventDefault()} onDrop={onDrop}>
    <MenuItem eventKey="1" onClick={e => dispatch(THUNK.closeFaq(faqref))}>Close</MenuItem>
    <AddFaqtMenuItem {...{isRO, faqref, dispatch}} />
  </DropdownButton>
}

export default connect()(FaqButton)

