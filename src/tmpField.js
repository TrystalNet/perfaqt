import {isEqual} from 'lodash'
import {updateUI} from './reducer'
import {editorStateToSaveState, getActiveLink} from './draftjs-utils'
import * as SELECT from './select'
import * as THUNK from './thunks'

function saveContent(tmpValue, objectId) {
  return (dispatch, getState) => {
    const {rawContentState, text} = editorStateToSaveState(tmpValue)
    const faqt = SELECT.getFaqtByKey(getState(), objectId)
    THUNK.updateOneFaqt(faqt, text, rawContentState)
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

export const saveActiveField = () => {
  return (dispatch, getState) => {
    const {fldName, objectId, tmpValue} = getState().ui.activeField
    if(!fldName) return
    switch(fldName) {
      case 'fldFaqt': return dispatch(saveContent(tmpValue, objectId))
      case 'fldTags': return dispatch(saveTags(tmpValue, objectId))
      case 'fldSearch' : return dispatch(saveSearch(tmpValue))
      case 'fldLink' : return console.log('dispatch please')
      default: throw `no luck saving ${tmpValue} into ${fldName}`
    }
  }
}

const getFaqtEditorState = (state, faqtKey) => state.faqts.get(faqtKey).editorState
const getFaqtTags = (state, faqtKey) => state.faqts.get(faqtKey).tags
const getSearch = state => state.ui.search.text || '' 

function getTmpValue(state, {fldName,objectId}) {
  if(!fldName) return null
  switch(fldName) {
    case 'fldFaqt': return getFaqtEditorState(state, objectId)
    case 'fldLink': return getActiveLink(state)
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
export const setActiveField = ({fldName, objectId, tmpValue}) => {
  return (dispatch, getState) => {
    dispatch(saveActiveField())
    const tmpValue = tmpValue || getTmpValue(getState(), {fldName,objectId})
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
    const tmpValue = getTmpValue(getState(), {fldName,objectId} )
    dispatch(updateUI({activeField:{fldName, objectId, tmpValue}}))
  }
}
