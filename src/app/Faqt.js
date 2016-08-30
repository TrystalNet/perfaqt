import React, { Component } from 'react';
import MyEditor from './Editor'

const styleContainerInactive = {
  display:'flex',
  paddingTop: 5,
  paddingBottom: 5,
  borderBottom: 'lightgrey 1px solid'
}

const styleInactive = {
  border: 'black 0px solid',
  flex:1,
  minWidth:0,
  overflowX: 'auto',
  marginRight: 5,
  whiteSpace:'pre-wrap',
  wordWrap:'break-word',
  maxHeight:'15vh',
  overflowY:'auto'
}

const styleTextareaActive = {
  border: 'black 0px solid',
  backgroundColor: 'beige',
  fontSize:14
}

const styleEditorContainer = {
  backgroundColor:'beige', 
  paddingTop:5, 
  paddingBottom:5, 
  marginBottom:4,
  marginRight: 48,
  maxHeight:'50vh',
  overflowY:'auto'
}

class Faqt extends Component {
  shouldComponentUpdate(nextProps) {
    if(nextProps.text !== this.props.text) return true
    if(nextProps.isActive !== this.props.isActive) return true
    return false
  }
  onKeyDown(e) {
    if(!this.props.isActive) return
    switch(e.keyCode) {
      case 27: break
      default: return
    }
    this.props.onDeactivate()
  }
  onBlur(e) {
    this.props.onDeactivate()
  }
  onDraftChanged(value) {
    this.props.onChange(value)
    this.props.onDeactivate()
  }
  render() {
    const {id, text, isActive, onSetBest, onChange, onActivate, onDeactivate} = this.props
    if(!isActive) {
      return <div style={styleContainerInactive}>
        <div style={styleInactive} onClick={onActivate}>{text}</div>
        <button onClick={onSetBest}>best</button>
      </div>
    }
    return <div style={styleEditorContainer}>
      <MyEditor {...{text}} onChanged={this.onDraftChanged.bind(this)}/>
    </div>
  }  
}

export default Faqt