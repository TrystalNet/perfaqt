import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as THUNK from '../thunks'

const LogoutButton = ({dispatch}) => {
  const onClick = e => {
    e.preventDefault()
    dispatch(THUNK.logout())
  }
  return <button onClick={onClick}>sign out</button>
}

export default connect()(LogoutButton)