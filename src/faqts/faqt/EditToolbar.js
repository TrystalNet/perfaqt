import React, { Component } from 'react';
import {
  ButtonToolbar, ButtonGroup, Button, Glyphicon,
  Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap'


const S1 = {  }

class LinkForm extends Component {
  constructor(props) {
    super(props)
    this.state = { value:'' }
  }
  handleChange(e) {
    this.setState({value:e.target.value})
  }
  render() {
    const {active} = this.props
    if(!active) return null
    return <Form inline>
      <FormGroup>
        <ControlLabel>Link:</ControlLabel>&nbsp;&nbsp;
        <FormControl type='text' value={this.state.value} placeholder='link' onChange={this.handleChange.bind(this)}/>
      </FormGroup>
    </Form>
  }
}

class EditToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showLink:false
    }
  }
  render() {
    const {active} = this.props
    if(!active) return null
    return <div style={S1}>
      <ButtonToolbar>
        <ButtonGroup> 
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
        </ButtonGroup>
        <ButtonGroup> 
          <Button>A</Button>
          <Button>B</Button>
          <Button onClick={()=>this.setState({showLink:!this.state.showLink})}><Glyphicon glyph="link" /></Button>
        </ButtonGroup>
      </ButtonToolbar>
      <LinkForm active={this.state.showLink} />
    </div>
  }
}
export default EditToolbar