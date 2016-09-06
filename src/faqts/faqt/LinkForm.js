import React, { Component } from 'react';
import {
  Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap'

class LinkForm extends Component {
  constructor(props) {
    super(props)
    this.state = { value:'' }
  }
  handleChange(e) {
    this.setState({value:e.target.value})
  }
  onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    if(this.props.onSaveLink) this.props.onSaveLink(this.state.value)
  }
  render() {
    const {active} = this.props
    if(!active) return null
    return <Form inline onSubmit={this.onSubmit.bind(this)} >
      <FormGroup bsSize='small'>
        <ControlLabel>Link:</ControlLabel>&nbsp;&nbsp;
        <FormControl type='text' value={this.state.value} placeholder='link' onChange={this.handleChange.bind(this)}/>
      </FormGroup>
    </Form>
  }
}

export default LinkForm