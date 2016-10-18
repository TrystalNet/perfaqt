import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import {setActiveField, updateActiveField, saveLinkToEditorState} from '../../tmpField'

function LinkForm({value, active, onSaveLink, dispatch}) {
  if(!active) return null
  const onSubmit = e => {
    console.log('LinkForm submitted')
    e.preventDefault()
    e.stopPropagation()
    // dispatch(setActiveField({fldName:null, objectId:null}))
    // onSaveLink(value)
    dispatch(saveLinkToEditorState(value))
  }
  const onChange = e => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(updateActiveField(e.target.value))
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
