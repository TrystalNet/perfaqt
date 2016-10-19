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
const MyEditor = ({ 
  editorState, isActive, 
  onFocus, onChange, onSave, onSaveAndExit 
}) => {
  const handleKeyCommand = command => {
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
    onBlur={onSave} 
    />
}

// if we don't use onblur to save the content, 
// then how do we know to save the content if we move to a different field?
// saving might be ok, but the save includes somehing more nefarious -- a move out of the field

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

function mapStateToProps(state, {editorState, isActive, faqtKey}) {
  if(isActive) editorState = EDIT.getTmpvalueByFldname(state, 'fldFaqt') || editorState
  return { editorState, isActive }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyEditor)




