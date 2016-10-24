import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Button } from 'react-bootstrap'

import * as THUNK  from '../thunks'

function CFaqButton({faq, dispatch}) {
  const onClick = e => { dispatch(THUNK.openFaq(faq)) }
  const {uid,faqId, isRO} = faq
  const id = `${uid}-${faqId}`
  const faqref = {uid, faqId}
  const bsStyle = 'default'
  const bsSize = 'xsmall'
  return <Button {...{bsStyle, bsSize}} id={id} onClick={onClick}>{faqId}</Button>
}

export default connect()(CFaqButton)

