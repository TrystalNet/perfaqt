import React, { Component } from 'react';
import { connect } from 'react-redux'
import MyEditor from './Editor'
import TagsEditor from './TagsEditor'
import EditToolbar from './EditToolbar'
import * as SELECT from '../../select'
import * as THUNK from '../../thunks'
import {updateUI} from '../../reducer'
import {addLinkToEditorState} from '../../draftjs-utils'

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
  maxHeight : '50vh'
}
const ScoreButton = ({isLinked, onDeleteScore}) => {
  if(!isLinked) return null
  const onClick = e => {
    e.preventDefault()
    onDeleteScore()
  }
  return <button onClick={onClick}>XXX</button>
}

const Faqt = ({
  faqtKey, 
  isRO, editorState, isLinked, isActive,
  onFocus, onSaveLink, onSetBest, onEditClick, onDeleteScore
})  => {
  const style = isActive ? Object.assign({},style0A,BEIGE) : style0A
  const editorContainerStyle = {}
  return <div style={S0}>
    <div style={style0}>
      <div style={style} onFocus={e => onFocus(isRO)}>
        <div>
          <EditToolbar active={isActive} faqtKey={faqtKey} onSaveLink={onSaveLink} />
          <div style={editorContainerStyle} onClick={onEditClick}>
            <MyEditor {...{faqtKey, editorState, isActive}} />
          </div>
        </div>
      </div>
      <div style={{display:'flex', flexDirection:'column'}}>
        <button onClick={onSetBest}>best</button>
        <ScoreButton {...{isLinked, onDeleteScore}} />
      </div>
    </div>
    <TagsEditor {...{faqtKey}} />
  </div>
}

function mapDispatchToProps(dispatch, {faqtKey}) {
  const onSetBest = () => dispatch(THUNK.setBestFaqtByKey(faqtKey))
  const onDeleteScore = () => dispatch(THUNK.deleteScore(faqtKey))
  const onEditClick = () => dispatch(THUNK.activateFaqt(faqtKey))
  const onFocus = () => dispatch(THUNK.activateFaqt(faqtKey))
  // editor handlers
  //------- toolbar handlers -------------- //
  const onSaveLink = (editorState, href) => {
    const newEditorState = addLinkToEditorState(editorState)
    if(newEditorState) dispatch(updateUI({editorState:newEditorState}))
  }
  // -------
  return { onFocus, onEditClick, onSaveLink, onSetBest, onDeleteScore }  
}

function mapStateToProps(state, ownProps) {
  const { faqtKey } = ownProps
  const { ui, faqts } = state
  const { faqref:{isRO}, editorState } = faqts.get(faqtKey)
  const isActive = faqtKey === ui.faqtKey
  const search = ui.search || {}
  const isLinked = search.scores ? search.scores.includes(faqtKey) : false
  return { isRO, editorState, isLinked, isActive }
}

export default connect(mapStateToProps, mapDispatchToProps)(Faqt)



