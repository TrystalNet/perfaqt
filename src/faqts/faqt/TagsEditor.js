import React, { Component } from 'react';

const S1 = { display:'flex', border:'black 0px solid', backgroundColor:'lightgrey', padding:5, paddingRight:6 }

class TagsEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {value:props.tags}
  }
  handleChange(e) {
    this.setState({value: e.target.value})
  }
  onKeyDown(e) {
    if(e.keyCode !== 13) return
    e.stopPropagation()
    e.preventDefault()
    this.props.onSave(this.state.value)
  }
  render() {
    const {tags} = this.props
    return <div style={S1}>
      <div style={{flex:0, margin:3, marginRight:8}}><b>Tags:</b></div>
      <input 
        ref={c => this._input = c} 
        type='text' 
        value={this.state.value} 
        onChange={this.handleChange.bind(this)}
        onKeyDown={this.onKeyDown.bind(this)} 
        style={{flex:1, border: 'red 0px solid', paddingLeft:5}}/>
    </div>
  }
}
export default TagsEditor