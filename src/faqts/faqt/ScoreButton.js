import React, { Component } from 'react';
import * as THUNK from '../../thunks'
import { connect } from 'react-redux'

const ScoreButton = ({score, onDelete}) => {
  if(!score) return null
  const onClick = event => {
    onDelete()
  }
  return <button onClick={onClick}>{score.value}</button>
}

function mapStateToProps(state, ownProps) {
  const { score } = ownProps
  return { score }
}

function mapDispatchToProps(dispatch, ownProps) {
  const { score } = ownProps
  return { 
    onDelete:  () => dispatch(THUNK.deleteScore(score.id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreButton)
