import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as SELECT from '../select'
import MyEditor from './Editor'
import * as THUNK from '../thunks' 

const style0 = {
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
const style0Ax = {
  backgroundColor : 'beige',
  maxHeight : '50vh'
}

class Faqt extends Component {
  shouldComponentUpdate(nextProps) {
    if(nextProps.text !== this.props.text) return true
    if(nextProps.isActive !== this.props.isActive) return true
    return false
  }
  onBlur(e) {
    // this.props.onDeactivate()
  }
  onFocus(e) {
    this.props.onActivate()
  }
  render() {
    const {isActive, text, draftjs, onSetBest, onSave, onSaveAndExit} = this.props
    const style = isActive ? Object.assign({},style0A,style0Ax) : style0A 
    return <div ref='container' style={style0}>
      <div style={style} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}>
        <MyEditor {...{text, draftjs, onSave, onSaveAndExit}} />
      </div>
      <button onClick={onSetBest}>best</button>
    </div>
  }  
}

function mapStateToProps(state, ownProps) {
  const { faqtId } = ownProps
  const { text, draftjs } = SELECT.getFaqtById(state, faqtId)
  const isActive = faqtId === state.ui.faqtId
  return { isActive, text, draftjs }
}

function mapDispatchToProps(dispatch, ownProps) {
  const {onSetBest, onActivate, onDeactivate} = ownProps
  return { 
    onSave: (text, draftjs) => dispatch(THUNK.updateFaqt(ownProps.faqtId, text, draftjs)),
    onSaveAndExit:  (text, draftjs) => dispatch(THUNK.updateFaqt(ownProps.faqtId, text, draftjs)),
    onSetBest, 
    onActivate, 
    onDeactivate 
  }
}

const FUCK = connect(mapStateToProps, mapDispatchToProps)(Faqt)
export default FUCK
