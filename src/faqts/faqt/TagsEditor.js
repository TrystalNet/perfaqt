import React, { Component } from 'react';

const S1 = { display:'flex', border:'black 1px solid', backgroundColor:'yellow', padding:3 }

class TagsEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {value:props.tags}
  }
  handleChange(e) {
    this.setState({value: e.target.value})
  }
  render() {
    const {tags} = this.props
    return <div style={S1}>
      <input type='text' value={this.state.value} onChange={this.handleChange} style={{flex:1}}/>
    </div>
  }
}
export default TagsEditor