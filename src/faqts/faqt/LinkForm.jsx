import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap'
import * as THUNK from '../../thunks'

function LinkForm({value, active, onSaveLink, dispatch}) {
  if(!active) return null
  const onSubmit = e => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(THUNK.setActiveField(null))
    onSaveLink(value)
  }
  const onChange = e => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(THUNK.updateActiveField(e.target.value))
  }
  return <Form inline onSubmit={onSubmit} >
    <FormGroup bsSize='small'>
      <ControlLabel>Link:</ControlLabel>&nbsp;&nbsp;
      <input type='text' value={value} onChange={onChange} />
    </FormGroup>
  </Form>
}

function mapStateToProps({ui:{activeField:{fldName,tmpValue}}}) {
  return fldName === 'fldLink' ? {value:tmpValue, active:true} : {value:'', active:false}
}
export default connect(mapStateToProps)(LinkForm)
