import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Button } from 'react-bootstrap'

import * as THUNK  from '../thunks'

function CFaqButton({faqref, dispatch}) {
  const onClick = e => { dispatch(THUNK.openFaq(faqref)) }
  const {uid,faqId, isRO} = faqref
  const id = `${uid}-${faqId}`
  const bsStyle = 'default'
  const bsSize = 'xsmall'
  return <Button {...{id, bsStyle, bsSize, onClick}}>{faqId}</Button>
}

export default connect()(CFaqButton)

