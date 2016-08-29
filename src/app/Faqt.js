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
  marginRight: 5
}

const styleTextareaActive = {
  border: 'black 0px solid',
  backgroundColor: 'beige',
  fontSize:14
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
    let fldText
    const {id, text, isActive, onSetBest, onChange, onActivate, onDeactivate} = this.props
    if(!isActive) {
      const bits = text.split(/\r?\n/)
      return (
        <div style={styleContainerInactive}>
          <div style={styleInactive} onClick={onActivate}>
            {
              bits.map((bit,index) => bit ? <div key={index}>{bit}</div> : <div key={index}>&nbsp;</div>)
            }
          </div>
          <button onClick={onSetBest}>best</button>
        </div>
      )
    }
    return <div style={{backgroundColor:'beige', paddingTop:5, paddingBottom:5, marginBottom:4}}><MyEditor {...{text}} onChanged={this.onDraftChanged.bind(this)}/></div>
  }  
}

export default Faqt