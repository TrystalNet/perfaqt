import React, { Component } from 'react';
import {
  Editor, EditorState, 
  convertFromRaw, convertToRaw,
  getDefaultKeyBinding, KeyBindingUtil,
  RichUtils 
} from 'draft-js'
import * as THUNK  from '../thunks'

const {hasCommandModifier} = KeyBindingUtil

function myKeyBindingFn(e) {
  if(e.keyCode === 13 && e.shiftKey) {
    e.preventDefault()
    e.stopPropagation()
    return 'save-and-exit'
  }
  // if(e.keyCode === 13) {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   return 'split-block'
  // }
  return getDefaultKeyBinding(e)
}

function buildBlock(text) {
  return {
    type:'unstyled',
    text:text
  }
}
function buildRawDraftContentState(text) {
  const block = buildBlock(text)
  return {
    blocks:[block],
    entityMap:{}
  }
}
function buildContentState(text) {
  const rawState = buildRawDraftContentState(text)
  return convertFromRaw(rawState)
}
function convertToText(rawDraftContentState) {
  return rawDraftContentState.blocks.map(block => block.text).join('\n')
}

class MyEditor extends Component {
  constructor(props) {
    super(props)

    let contentState = buildContentState(props.text)

    if(props.draftjs) {
      const draftjs = props.draftjs;
      if(!draftjs.blocks) draftjs.blocks = [{type:'unstyled',text:props.text}];
      if(!draftjs.entityMap) draftjs.entityMap = {}
      contentState = convertFromRaw(draftjs)
    }

    const editorState = EditorState.createWithContent(contentState)
    this.state = {editorState: editorState}
    this.onChange = editorState => this.setState({editorState})
  }
  saveChanges() {
    const editorState = this.state.editorState
    const contentState = editorState.getCurrentContent()
    const draftjs = convertToRaw(contentState)
    const text = convertToText(draftjs)
    this.props.onSave(text, draftjs)
  }
  saveChangesAndExit() {
    const editorState = this.state.editorState
    const contentState = editorState.getCurrentContent()
    const draftjs = convertToRaw(contentState)
    const text = convertToText(draftjs)
    this.props.onSave(text, draftjs,'search')
  }
  saveChangesAndBlur() {
    const editorState = this.state.editorState
    const contentState = editorState.getCurrentContent()
    const draftjs = convertToRaw(contentState)
    const text = convertToText(draftjs)
    this.props.onSave(text, draftjs, 'nothing')
  }
  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command)
    if(newState) {
      this.onChange(newState)
      return true
    }
    if(command === 'save-and-exit') {
      this.saveChangesAndExit()
      return true
    }
    return false
  }  
  render() {
    return <Editor 
      placeHolder="...faqt..."
      handleKeyCommand={this.handleKeyCommand.bind(this)}
      keyBindingFn={myKeyBindingFn}
      editorState={this.state.editorState} 
      onEscape={this.saveChangesAndExit.bind(this)}
      onBlur={this.saveChangesAndBlur.bind(this)}
      onChange={this.onChange} />
  }  
}

export default MyEditor

