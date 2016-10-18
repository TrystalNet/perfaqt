import React, { Component } from 'react';
import { connect } from 'react-redux'
import MyEditor from './Editor'
import TagsEditor from './TagsEditor'
import EditToolbar from './EditToolbar'
import * as SELECT from '../../select'
import * as THUNK from '../../thunks'
import {updateUI} from '../../reducer'
import {addLinkToEditorState} from '../../draftjs-utils'
import {DropdownButton, MenuItem} from 'react-bootstrap'
console.log('DDB', DropdownButton)


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
const Faqt = ({
  faqtKey, 
  editorState, isRO, isLinked, isActive, isHot, 
  onFocus, onSaveLink, onSetBest, onEditClick, onDeleteScore
})  => {
  const style = isActive ? Object.assign({},style0A,BEIGE) : style0A
  const editorContainerStyle = {}
  return <div style={S0}>
    <div style={style0}>
      <div style={style} onFocus={e => onFocus(isRO)}>
        <div>
          <EditToolbar {...{isHot, faqtKey, onSaveLink}} />
          <div style={editorContainerStyle} onClick={onEditClick}>
            <MyEditor {...{faqtKey, editorState, isActive}} />
          </div>
        </div>
      </div>
      <div style={{display:'flex', flexDirection:'column'}}>
        <DropdownButton id='rank' title='rank' bsStyle='default'>
          <MenuItem eventKey="best" onClick={onSetBest}>Best</MenuItem>
          <MenuItem eventKey="none" disabled={!isLinked} onClick={onDeleteScore}>Clear</MenuItem>
        </DropdownButton>
      </div>
    </div>
    <TagsEditor {...{faqtKey}} />
  </div>
}

function mapDispatchToProps(dispatch, {faqtKey}) {
  const onSetBest = () => dispatch(THUNK.setBestFaqtByKey(faqtKey))
  const onDeleteScore = () => dispatch(THUNK.deleteScore(faqtKey))
  const onEditClick = e => {
    e.preventDefault()
    e.stopPropagation()
    return dispatch(THUNK.activateFaqt(faqtKey))
  }
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

function amIHot(isActive, fldName) {
  if(!isActive) return false
  switch(fldName) {
    case 'fldFaqt': return true
    case 'fldLink': return true
    default: return false    
  }
}

function mapStateToProps(state, ownProps) {
  const { faqtKey } = ownProps
  const { ui, faqts } = state
  const { faqref:{isRO}, editorState } = faqts.get(faqtKey)
  const isActive = faqtKey === ui.faqtKey
  const search = ui.search || {}
  const isLinked = search.scores ? search.scores.includes(faqtKey) : false

  const isHot = amIHot(isActive, state.ui.activeField.fldName)

  return { isRO, editorState, isLinked, isActive, isHot }
}

export default connect(mapStateToProps, mapDispatchToProps)(Faqt)



