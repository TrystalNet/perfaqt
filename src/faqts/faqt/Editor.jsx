import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  Editor, EditorState, 
  convertFromRaw, convertToRaw,
  getDefaultKeyBinding, KeyBindingUtil,
  RichUtils, Entity, Modifier,
  CompositeDecorator
} from 'draft-js'
import EditToolbar from './EditToolbar'
import * as THUNK from '../../thunks'

const {hasCommandModifier} = KeyBindingUtil

function myKeyBindingFn(e) {
  if(e.keyCode === 13 && e.shiftKey) {
    e.preventDefault()
    e.stopPropagation()
    return 'save-and-exit'
  }
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

function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(
    character => {
      const entityKey = character.getEntity();
      return entityKey !== null && Entity.get(entityKey).getType() === 'LINK'
    },
    callback
  );
}

const styles = {
  link: {
    color: '#3b5998',
    textDecoration: 'underline'
  }
}

function navigate(url) {
  window.open(url, '_blank')
}

const Link = props => {
  const {href} = Entity.get(props.entityKey).getData();
  return <a href={href} style={styles.link} onClick={()=>navigate(href)}>{props.children}</a>
}
//  

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

    const decorator = new CompositeDecorator([{strategy:findLinkEntities, component:Link}])
    const editorState = EditorState.createWithContent(contentState, decorator)
    this.state = {editorState}
    this.onChange = editorState => {
      this.setState({editorState})
      props.dispatch(THUNK.setDraftjs(editorState))
    }
  }
  saveChangesAndExit() {
    const editorState = this.state.editorState
    const contentState = editorState.getCurrentContent()
    const draftjs = convertToRaw(contentState)
    const text = convertToText(draftjs)
    this.props.onSave(text, draftjs,'SEARCH')
  }
  saveChanges() {
    const editorState = this.state.editorState
    const contentState = editorState.getCurrentContent()
    const draftjs = convertToRaw(contentState)
    const text = convertToText(draftjs)
    this.props.onSave(text, draftjs)
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
  onSaveLink(href) {
    const oldEditorState = this.state.editorState
    const selection = oldEditorState.getSelection()
    if(selection.isCollapsed()) return
    const key = Entity.create('LINK', 'MUTABLE', {href});
    const editorState = RichUtils.toggleLink(oldEditorState, selection, key)
    this.setState({editorState})
  }

  render() {
    const {isActive} = this.props
    return <div>
      <EditToolbar active={isActive} onSaveLink={href=> this.onSaveLink(href)} />
      <Editor 
        placeHolder="...faqt..."
        handleKeyCommand={this.handleKeyCommand.bind(this)}
        keyBindingFn={myKeyBindingFn}
        editorState={this.state.editorState} 
        onEscape={this.saveChangesAndExit.bind(this)}
        onBlur={this.saveChanges.bind(this)}
        onChange={this.onChange} />
    </div>
  }  
}

export default connect()(MyEditor)

// working on getting links in, just about there.... looking to have them rendered
