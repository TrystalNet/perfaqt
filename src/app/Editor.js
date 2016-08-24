import React, { Component } from 'react';
import {
  Editor, EditorState, 
  convertFromRaw, convertToRaw, 
  getDefaultKeyBinding, KeyBindingUtil,
  DraftHandleValue, Modifier
} from 'draft-js'

const {hasCommandModifier} = KeyBindingUtil
const SAVEANDEXIT = 'save-and-exit'

function myKeyBindingFn(e) {
  switch(e.keyCode) {
    case 121: 
    case 27: return SAVEANDEXIT  // 27 doesn't work for some reason 
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

class MyEditor extends Component {
  constructor(props) {
    super(props)
    const contentState = buildContentState(props.text)
    const editorState = EditorState.createWithContent(contentState)
    this.state = {editorState: editorState}
    this.onChange = editorState => this.setState({editorState})
  }
  saveAndExit() {
    const editorState = this.state.editorState
    const contentState = editorState.getCurrentContent()
    const rawDraftContentState = convertToRaw(contentState)
    const text = convertToText(rawDraftContentState)
    this.props.onChanged(text)
  }
  handleKeyCommand(command) {
    switch(command) {
      case SAVEANDEXIT: this.saveAndExit(); break
      default: return false
    }
    return true
  }
  render() {
    return <Editor 
      editorState={this.state.editorState} 
      placeHolder="...you answer..."
      handleKeyCommand={this.handleKeyCommand.bind(this)}
      keyBindingFn={myKeyBindingFn}
      onEscape={this.saveAndExit.bind(this)}
      onChange={this.onChange} />
  }  
}

export default MyEditor



//       handleReturn={this.handleReturn}










// junk


    // let fldText
    // const {text, onChange} = this.props
    // return (
    //   <div>
    //     <textarea
    //       style={styleTextareaActive}
    //       ref={node => {fldText=node}} 
    //       value={text} 
    //       cols={72} 
    //       onKeyDown={this.onKeyDown.bind(this)}
    //       onBlur={() => this.onBlur.bind(this)}
    //       onChange={()=>onChange(fldText.value)}>
    //     </textarea>
    //   </div>
    // )

  // shouldComponentUpdate(nextProps) {
  //   if(nextProps.text !== this.props.text) return true
  //   if(nextProps.isActive !== this.props.isActive) return true
  //   return false
  // }
  // onKeyDown(e) {
  //   if(!this.props.isActive) return
  //   switch(e.keyCode) {
  //     case 27: break
  //     default: return
  //   }
  //   this.props.onDeactivate()
  // }
  // onBlur(e) {
  //   console.log('blur heard')
  //   this.props.onDeactivate()
  // }


// const styleContainerInactive = {
//   display:'flex',
//   paddingTop: 5,
//   paddingBottom: 5,
//   borderBottom: 'lightgrey 1px solid'
// }

// const styleInactive = {
//   border: 'black 0px solid',
//   flex:1  
// }

// const styleTextareaActive = {
//   border: 'black 0px solid',
//   backgroundColor: 'beige',
//   fontSize:14
// }
