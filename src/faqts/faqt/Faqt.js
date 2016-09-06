import React, { Component } from 'react';
import { connect } from 'react-redux'
import MyEditor from './Editor'
import TagsEditor from './TagsEditor'
import ScoreButton from './ScoreButton'

const S0 = {backgroundColor:'paleblue',marginBottom:5, padding:1}
const style0 = {
  backgroundColor:'white',
  display:'flex',
  paddingTop: 5,
  paddingBottom: 5,
  borderBottom: 'lightgrey 1px solid'
}
const style0A = {
  flex:1,
  minWidth:0,
  marginRight: 5,
  overflowX: 'auto',
  maxHeight:'15vh',
  overflowY:'auto'
}
const BEIGE = {
  backgroundColor : 'beige',
  maxHeight : '50vh'
}

const TagsControl = ({isActive, tags, onSave}) => {
  const styleTagsB = { fontSize:'small', fontStyle:'italic' }
  return isActive 
    ? <TagsEditor {...{tags, onSave}} />
    : null
}

class Faqt extends Component {
  onFocus(e) {
    this.props.onActivate()
  }
  render() {
    const {
      isActive, focusedControl, text, draftjs, tags, score, 
      onSetBest, onSave, onSaveTags
    } = this.props
    const style = isActive ? Object.assign({},style0A,BEIGE) : style0A
    return <div style={S0}>
      <div ref='container' style={style0}>
        <div style={style} onFocus={this.onFocus.bind(this)}>
          <MyEditor ref={node => this.refEdit = node} {...{text, isActive, draftjs, onSave}} />
        </div>
        <div style={{display:'flex', flexDirection:'column'}}>
          <button onClick={onSetBest}>best</button>
          <ScoreButton {...{score}} />
        </div>
      </div>
      <TagsControl {...{isActive, tags, onSave:onSaveTags}} />
    </div>
  }  
}
export default Faqt



