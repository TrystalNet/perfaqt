import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as THUNK from '../thunks'

const SB1 = {fontSize:20, paddingLeft:20, paddingRight:20}

const SignupButton = ({fldEmail,fldPassword,dispatch}) => {
  const onClick = e => {
    e.preventDefault()
    dispatch(THUNK.signup(fldEmail, fldPassword))
  } 
  return <button style={SB1} onClick={onClick}>Sign up</button>
} 

const mapStateToProps = ({ui:{fldEmail,fldPassword}}) => ({fldEmail, fldPassword})
export default connect(mapStateToProps)(SignupButton)