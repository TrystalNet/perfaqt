// ...this is deprecated...

import React, { Component } from 'react';
import * as THUNK from '../thunks'
import { connect } from 'react-redux'

const ScoreButton = ({faqtKey, dispatch}) => {
  if(!faqtKey) return null
  const onClick = e => {
    e.preventDefault()
    dispatch(THUNK.deleteScore(faqtKey))
  }
  return <button onClick={onClick}>XXX</button>
}

export default connect()(ScoreButton)
