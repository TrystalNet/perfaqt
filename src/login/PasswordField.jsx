import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateUI } from '../reducer'

const S1 = { display:'flex', padding:10, textAlign:'right' }
const S2 = { flex:1, marginRight:10 }

const PasswordField = ({fldPassword, dispatch}) => {
  const onChange = e => {
    e.preventDefault()
    dispatch(updateUI({fldPassword:e.target.value}))
  }
  return <div style={S1}>
    <div style={S2}>password:</div>
    <input type='password' value={fldPassword} onChange={onChange} />
  </div>
}

const mapStateToProps = ({ui:{fldPassword}}) => ({fldPassword})
export default connect(mapStateToProps)(PasswordField)
