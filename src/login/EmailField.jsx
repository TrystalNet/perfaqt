import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateUI } from '../reducers/reducer-ui'


const S1 = { display:'flex', padding:10, textAlign:'right' }
const S2 = { flex:1, marginRight:10 }

const EmailField = ({fldEmail, dispatch}) => {
  const onChange = (e) => {
    e.preventDefault()
    dispatch(updateUI({fldEmail:e.target.value}))
  }
  return <div style={S1}>
    <div style={S2}>email:</div>
    <input type='text' value={fldEmail} onChange={onChange} />
  </div>
}

const mapStateToProps = ({ui:{fldEmail}}) => ({fldEmail})
export default connect(mapStateToProps)(EmailField)
