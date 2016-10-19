import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as THUNK from '../thunks'
import {Button} from 'react-bootstrap'

const LogoutButton = ({dispatch}) => {
  const onClick = e => {
    e.preventDefault()
    dispatch(THUNK.logout())
  }
  return <Button onClick={onClick} style={{marginRight:10}}>sign out</Button>
}

export default connect()(LogoutButton)