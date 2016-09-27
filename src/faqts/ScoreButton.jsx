import React, { Component } from 'react';
import * as THUNK from '../thunks'
import { connect } from 'react-redux'

const ScoreButton = ({score, dispatch}) => {
  if(!score) return null
  const onClick = e => {
    e.preventDefault()
    dispatch(THUNK.deleteScore(score))
  }
  return <button onClick={onClick}>{score.value}</button>
}

export default connect((state, ownProps) => ({score:ownProps.score}))(ScoreButton)
