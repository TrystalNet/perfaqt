import React, { Component } from 'react';
import { connect } from 'react-redux'
import MyEditor from './Editor'
import TagsEditor from './TagsEditor'
import EditToolbar from './EditToolbar'
import * as SELECT from '../../select'
import * as THUNK from '../../thunks'
import {updateUI} from '../../reducers/reducer'
import {addLinkToEditorState} from '../../draftjs-utils'
import {Button, DropdownButton, MenuItem} from 'react-bootstrap'

// VERSIONS OF FAQTS TO POSSIBLY SHOW
// 1. READONLY, NOTACTIVE
// 2. READONLY, ACTIVE
// 3. READWRITE, NOTACTIVE
// 4. READWRITE, ACTIVE, NOT EDITING
// 5. READWRITE, ACTIVE, EDITING


const S0 = {backgroundColor:'paleblue',marginBottom:5, padding:1}
const style0 = {
  backgroundColor:'white',
  display:'flex',
  paddingTop: 5,
  paddingBottom: 5,
  borderBottom: 'transparent 15px solid'
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
  maxHeight : '50vh'
}

const Faqt = ({
  faqtKey, 
  url, editorState, isRO, isLinked, isActive, isHovering, 
  onFocus, onSaveLink, onSetBest, onDeleteScore, onMouseEnter, onMouseLeave, onAddLink, onDropLink, onEditContent,
  onDone
})  => {
  const style = isActive ? Object.assign({},style0A,BEIGE) : style0A
  const editorContainerStyle = {}
  const ddbStyle = isHovering ? {} : {visibility:'hidden'}
  return <div style={S0} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onDragOver={e => e.preventDefault()} onDrop={onDropLink}>
    <div style={style0}>
      <div style={style} onFocus={e => onFocus(isRO)}>
        { url ? <a href={url} target='_blank'>{url}</a> : null }
        <div>
          <EditToolbar {...{isActive, faqtKey, onSaveLink}} />
          <div style={editorContainerStyle}>
            <MyEditor {...{faqtKey, editorState, isActive}} />
          </div>
        </div>
      </div>
      <div style={{display:'flex', flexDirection:'column'}}>
          <DropdownButton id='rank' bsStyle='default' title='edit' style={ddbStyle}>
            <MenuItem eventKey="edit" onClick={onEditContent}>Faqt</MenuItem>
            <MenuItem eventKey='link' onClick={onAddLink}>Link</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey="best" onClick={onSetBest}>Best</MenuItem>
            <MenuItem eventKey="none" disabled={!isLinked} onClick={onDeleteScore}>Clear</MenuItem>
          </DropdownButton>
          <Button id='done' style={{visibility:isActive ? 'visible':'hidden'}} onClick={onDone}>done</Button>
      </div>
    </div>
    { false ? <TagsEditor {...{faqtKey}} /> : null }
  </div>
}

function mapDispatchToProps(dispatch, {faqtKey}) {
  const onDropLink = e => {
    e.preventDefault()
    e.stopPropagation()
    const url = e.dataTransfer.getData('URL')
    if(!url) return
    dispatch(THUNK.addLink(faqtKey, url))
  }
  const onAddLink = () => {
    dispatch(THUNK.addLink(faqtKey, 'http://www.heinz.com/sustainability/nutrition.aspx'))
  }
  const onMouseEnter = () => {
    dispatch(THUNK.hoverFaqt(faqtKey))
  }
  const onMouseLeave = () => {
    dispatch(THUNK.hoverFaqt(null))
  }
  const onDone=() => {
    dispatch(THUNK.activateFaqt(null))
  }
  const onEditContent = e => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(THUNK.editFaqt(faqtKey))
  }
  const onSetBest = () => dispatch(THUNK.setBestFaqtByKey(faqtKey))
  const onDeleteScore = () => dispatch(THUNK.deleteScore(faqtKey))
  const onFocus = () => dispatch(THUNK.activateFaqt(faqtKey))
  // editor handlers
  //------- toolbar handlers -------------- //
  const onSaveLink = (editorState, href) => {
    const newEditorState = addLinkToEditorState(editorState)
    if(newEditorState) dispatch(updateUI({editorState:newEditorState}))
  }
  // -------
  return { onFocus, onSaveLink, onSetBest, onDeleteScore, onMouseEnter, onMouseLeave, onAddLink, onDropLink, onEditContent, onDone }  
}

function mapStateToProps(state, ownProps) {
  const { faqtKey } = ownProps
  const { ui, faqts } = state
  const { faqref:{isRO}, editorState, url } = faqts.get(faqtKey)
  const isActive = faqtKey === ui.faqtKey
  const isHovering = faqtKey === ui.hoverFaqtKey
  const search = ui.search || {}
  const isLinked = search.scores ? search.scores.includes(faqtKey) : false
  return { url, isRO, editorState, isLinked, isActive, isHovering }
}

export default connect(mapStateToProps, mapDispatchToProps)(Faqt)



