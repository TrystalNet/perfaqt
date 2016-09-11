import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as THUNK from '../thunks'

const SB1 = {fontSize:20, paddingLeft:20, paddingRight:20}

const LoginButton = ({fldEmail, fldPassword, dispatch}) => {
  const onClick = e => {
    e.preventDefault()
    dispatch(THUNK.login(fldEmail, fldPassword))
  } 
  return <button style={SB1} onClick={onClick}>Log in</button>
} 

const mapStateToProps = ({ui:{fldEmail,fldPassword}}) => ({fldEmail, fldPassword})
export default connect(mapStateToProps)(LoginButton)