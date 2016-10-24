import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as THUNK from '../thunks'
import {Button} from 'react-bootstrap'

const LogoutButton = ({username, isAdmin, dispatch}) => {
  const onClick = e => {
    e.preventDefault()
    dispatch(THUNK.logout())
  }
  const text = `sign out ${username}` || 'sign out'
  const bsStyle = isAdmin ? 'warning' : null
  return <Button bsStyle={bsStyle} onClick={onClick} style={{marginRight:10}}>{text}</Button>
}

const getPropsFromState = (state) => {
  const username = state.ui.username || null
  const isAdmin = state.ui.isAdmin || false
  return {username, isAdmin}
}
export default connect(getPropsFromState)(LogoutButton)