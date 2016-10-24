import {isEqual} from 'lodash'
import {updateUI, pushActiveField, popActiveField} from './reducers/reducer-ui'
import {editorStateToSaveState, getActiveLink, addLinkToEditorState} from './draftjs-utils'
import * as SELECT from './select'
import * as THUNK from './thunks'

function saveContent(tmpValue, objectId) {
  return (dispatch, getState) => {
    const {rawContentState, text} = editorStateToSaveState(tmpValue)
    const faqt = SELECT.getFaqtByKey(getState(), objectId)
    THUNK.updateOneFaqt(faqt, text, rawContentState)
    // dispatch(THUNK.activateFaqt(null))
  }
}
function saveTags(tmpValue, objectId) {
  return (dispatch, getState) => {
    const faqt = SELECT.getFaqtByKey(getState(), objectId)
    dispatch(THUNK.saveTagsToFB(faqt, tmpValue))
  }
}
function saveSearch(tmpValue) {
  return (dispatch) => {
    dispatch(THUNK.handleSearchRequest(tmpValue))
  }
}

function saveLinkToFaqt(href) {
  return (dispatch, getState) => {
    const faqt = getActiveFaqt(getState())
    const editorState = faqt.editorState;
    const newEditorState = addLinkToEditorState(editorState, href)
    if(newEditorState) dispatch(updateUI({editorState:newEditorState}))
  }
}

export const saveActiveField = () => {
  return (dispatch, getState) => {
    const {fldName, objectId, tmpValue} = getState().ui.activeField
    if(!fldName) return
    switch(fldName) {
      case 'fldFaqt'  : return dispatch(saveContent(tmpValue, objectId))
      case 'fldTags'  : return dispatch(saveTags(tmpValue, objectId))
      case 'fldSearch': return dispatch(saveSearch(tmpValue))
      case 'fldLink'  : return dispatch(saveLinkToFaqt(tmpValue))
      default: throw `no luck saving ${tmpValue} into ${fldName}`
    }
  }
}

const getFaqtEditorState = (state, faqtKey) => state.faqts.get(faqtKey).editorState
const getActiveEditorState = state => getFaqtEditorState(state, state.ui.faqtKey)
const getActiveFaqt = state => state.faqts.get(state.ui.faqtKey)
const getFaqtTags = (state, faqtKey) => state.faqts.get(faqtKey).tags
const getSearch = state => state.ui.search.text || ''
const getFocusedLink = state => {
  const editorState = state.ui.activeFieldStack[0].tmpValue
  return getActiveLink(editorState)
} 

export function getTmpvalueByFldname(state, fldName) {
  const {activeField, activeFieldStack} = state.ui
  if(activeField.fldName === fldName) return activeField.tmpValue
  const stackField = activeFieldStack.find(item => item.fldName === fldName)
  return stackField ? stackField.tmpValue : null
}


function getValue(state, {fldName,objectId}) {
  if(!fldName) return null
  switch(fldName) {
    case 'fldFaqt': return getFaqtEditorState(state, objectId)
    case 'fldLink': return getFocusedLink(state)
    case 'fldTags': return getFaqtTags(state, objectId)
    case 'fldSearch': return getSearch(state)
    default: return ''
  }
}
export const updateActiveField = tmpValue => {
  return (dispatch, getState) => {
    const {fldName, objectId} = getState().ui.activeField
    dispatch(updateUI({activeField:{fldName, objectId, tmpValue}}))
  }
}
export const toggleActiveField = (fldKey) => {
  return (dispatch, getState) => {
    dispatch(saveActiveField())
    const isShowing = isEqual(fldKey, getState().ui.activeField)
    if(isShowing) fldKey = {fldName:null, objectId:null}
    dispatch(setActiveField(fldKey))
  }
}
export const resetActiveField = () => {
  return (dispatch, getState) => {
    const {fldName, objectId} = getState().ui.activeField
    const tmpValue = getValue(getState(), {fldName,objectId} )
    dispatch(updateUI({activeField:{fldName, objectId, tmpValue}}))
  }
}
export const setActiveField = ({fldName, objectId, tmpValue:value}) => {
  return (dispatch, getState) => {
    switch(fldName) {
      case 'fldLink': dispatch(pushActiveField()); break
      default: dispatch(saveActiveField()); break
    }
    const value = value || getValue(getState(), { fldName, objectId })
    dispatch(updateUI({activeField:{fldName, objectId, tmpValue:value}}))
  }
}
export function saveLinkToEditorState(href) {
  return (dispatch, getState) => {
    dispatch(popActiveField())
    const editorState = addLinkToEditorState(getState().ui.activeField.tmpValue, href)
    if(editorState) dispatch(updateActiveField(editorState))
  }
}


// but... when we jump out of the edit field, how do we know to pop instead 
// just starting from scratch... ACK
// we know because of the state.
//
// what is the most common case here... it is pressing enter
// in that case we would want to save the link, close the link field, 
// and set the focus back to the content section
// ...
// so there would be an action -- saveLink (which is already in place)
//    // where is the enter key detected?
// it would .... copy the link into editorState (which is on the stack)
// it would .... pop the stack off
