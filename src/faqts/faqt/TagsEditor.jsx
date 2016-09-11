import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as SELECT from '../../select'

const S1 = { display:'flex', border:'black 0px solid', backgroundColor:'lightgrey', padding:5, paddingRight:6 }
const S2 = {flex:0, margin:3, marginRight:8}
const S3 = {flex:1, border: 'red 0px solid', paddingLeft:5}

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
      <div style={S2}><b>Tags:</b></div>
      <input 
        ref={c => this._input = c} 
        type='text' 
        value={this.state.value} 
        onChange={this.handleChange.bind(this)}
        onKeyDown={this.onKeyDown.bind(this)} 
        style={S3}/>
    </div>
  }
}
const mapStateToProps = (state, ownProps) => {
  const { ui:{faqref, faqtId} } = state
  const { tags } = SELECT.getFaqt(state, faqref, faqtId)
  return {tags}
}
export default connect(mapStateToProps)(TagsEditor)