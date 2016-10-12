import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Editor, getDefaultKeyBinding, KeyBindingUtil, RichUtils } from 'draft-js'
import * as THUNK from '../../thunks'
import {updateUI} from '../../reducer'
import * as EDIT from '../../tmpField'

const {hasCommandModifier} = KeyBindingUtil
const s1a = {padding:10, backgroundColor:'whitesmoke'}
const s1b = Object.assign({}, s1a, { border:'lightgrey 1px solid' })

function myKeyBindingFn(e) {
  if(e.keyCode === 13 && e.shiftKey) {
    e.preventDefault()
    e.stopPropagation()
    return 'save-and-exit'
  }
  const binding = getDefaultKeyBinding(e)
  return binding
}
function navigate(url) {
  console.log(url)
  window.open(url, '_blank')
}
const MyEditor = ({ 
  editorState, isActive, 
  onFocus, onChange, onSave, onSaveAndExit 
}) => {
  const handleKeyCommand = command => {
    console.log(command)
    const newEditorState = RichUtils.handleKeyCommand(editorState, command)
    if(newEditorState && newEditorState !== editorState) onChange(newEditorState)
    else switch(command) {
      case 'save-and-exit': onSaveAndExit(); break  
      default: return false      
    }
    return true
  }  
  return <Editor placeHolder="...faqt..."
    editorState={editorState} 
    readOnly={!isActive}
    style={isActive ? s1b: s1a} 
    keyBindingFn={myKeyBindingFn}
    handleKeyCommand={handleKeyCommand}
    onChange={onChange}
    onEscape={onSaveAndExit}
    onFocus={onFocus}
    onBlur={onSave} />
}

function mapDispatchToProps(dispatch,{faqtKey, editorState, isActive}) {
  return {
    onChange: editorState => {
      dispatch(EDIT.updateActiveField(editorState))
    },
    onSave: e => dispatch(EDIT.saveActiveField()),
    onFocus: e => {
      const fldName = 'fldFaqt'
      const objectId = faqtKey
      const tmpValue = editorState
      dispatch(EDIT.setActiveField({fldName, objectId, tmpValue})) 
    },
    onSaveAndExit: e => {
      dispatch(EDIT.saveActiveField())
      dispatch(THUNK.setNextFocus('SEARCH'))
    }
  }
}

// how to know whether to editorState the property or editorState from the tmpField
// 1. is the faqt active ... maybe this is enough?!; maybe we want to know if it is focused, but maybe not needed
// wait... the issue is first that setActiveField has to be called from someplace
function mapStateToProps(state, {editorState, isActive, faqtKey}) {
  const {fldName, objectId, tmpValue} = state.ui.activeField
  if(fldName === 'fldFaqt' && faqtKey === objectId) editorState = tmpValue
  return { editorState, isActive }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyEditor)

// onFocus={e => { console.log('focused on the editor'); e.preventDefault(); e.stopPropagation(); }}
// working on getting links in, just about there.... looking to have them rendered





