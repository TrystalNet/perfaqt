import React, { Component } from 'react';
import {
  ButtonToolbar, ButtonGroup, Button, Glyphicon,
  Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap'
import LinkForm from './LinkForm'

const S1 = { marginBottom:20 }

class EditToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showLink:false
    }
  }
   render() {
    const {active, onSaveLink} = this.props
    if(!active) return null
     return <div style={S1}>
       <ButtonToolbar>
        <ButtonGroup> 
          <Button onClick={()=>this.setState({showLink:!this.state.showLink})}><Glyphicon glyph="link" /></Button>
         </ButtonGroup>
       </ButtonToolbar>
       <LinkForm active={this.state.showLink} onSaveLink={onSaveLink} />
     </div>
   }
}
export default EditToolbar