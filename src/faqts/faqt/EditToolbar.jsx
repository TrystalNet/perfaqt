import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  ButtonToolbar, ButtonGroup, Button, Glyphicon,
  Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap'
import LinkForm from './LinkForm'
import * as THUNK from '../../thunks'

const S1 = { marginBottom:20 }

function EditToolbar({active, onSaveLink, dispatch}) {
  if(!active) return null
  return <div style={S1}>
    <ButtonToolbar>
      <ButtonGroup> 
        <Button onClick={e => dispatch(THUNK.toggleActiveField('fldLink'))}>
          <Glyphicon glyph="link" />
        </Button>
      </ButtonGroup>
    </ButtonToolbar>
    <LinkForm onSaveLink={onSaveLink} />
  </div>
}
export default connect()(EditToolbar)