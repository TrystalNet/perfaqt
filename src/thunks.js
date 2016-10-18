import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

import $ from 'jquery'
import _ from 'lodash'
import * as xxx from 'lodash'
import {Entity} from 'draft-js'
import * as UNIQ from '@trystal/uniq-ish'
import * as SELECT from './select'
import * as FAQTS from './faqts/faqts-actions'
import * as FULLTEXT from './fulltext'
import {addFaq as ADDFAQ, removeFaq as REMFAQ} from './reducer'
import {updateUI, popActiveField} from './reducer-ui'
import {updateActiveField} from './tmpField'
import {faqtToEditorState} from './draftjs-utils'

// tomorrow --- finish putting editor state into the faqts as they are loaded and created
// then detect when one of them is being edited.

const faqtToKey = SELECT.faqtToKey

const faqPath = ({uid, faqId}) => `${uid}/${faqId}`

const faqtsPath = faqref => `faqts/${faqPath(faqref)}`
const faqtsRef = faqref => firebase.database().ref().child(faqtsPath(faqref))
const faqtPath = ({faqref, id}) => `${faqtsPath(faqref)}/${id}`
const faqtPropPath = (faqt, propname) => `${faqtPath(faqt)}/${propname}`
const faqtTagsPath = faqt => faqtPropPath(faqt,'tags')
const faqtTextPath = faqt => faqtPropPath(faqt,'text')
const faqtDraftjsPath = faqt => faqtPropPath(faqt,'draftjs')
const faqtUpdatedPath = faqt => faqtPropPath(faqt,'updated')
const faqtRankPath = faqt => faqtPropPath(faqt,'rank')

const saveSearchWithScores = search => (dispatch, getState, {idb}) => {
  if(!search) return
  const putreq = idb.transaction('searches','readwrite').objectStore('searches').put(search)
  putreq.onsuccess = e => dispatch(updateUI({search}))
}
const addFaqtKeyToSearch = (search, faqtKey) => {
  const {text='', scores=[]} = search
  switch(scores.indexOf(faqtKey)) {
    case 0: return null
    case -1: return {text, scores:[faqtKey,...scores]}
    default: return {text, scores:[faqtKey,...scores.filter(score => score !== faqtKey)]}
  }
}
export const setBestFaqtByKey = (faqtKey) => {
  return (dispatch, getState) => {
    const {search} = getState().ui  
    dispatch(saveSearchWithScores(addFaqtKeyToSearch(search, faqtKey)))
  }
}
export const deleteScore = faqtKey => (dispatch, getState) => {
  const {text,scores} = getState().ui.search
  dispatch(saveSearchWithScores({text, scores:scores.filter(score => score !== faqtKey)}))
}
const denit = (ref, ...handlers) => handlers.forEach(handler => ref.off(handler))

let defaultTime = new Date(2016,1,1).getTime()  // temporary solution to support legacy faqts

const fbToFaqt = (faqref, snap) => {
  const {text, draftjs, tags, rank, created, updated} = snap.val()
  const editorState = faqtToEditorState(draftjs, text)
  const whenCreated = created || defaultTime++
  const whenUpdated = updated || whenCreated
  return { 
    faqref, id:snap.key, 
    editorState, text, tags,
    rank,
    created: whenCreated, 
    updated: whenUpdated 
  }
}

function initFaqts(faqref) {
  return (dispatch, getState) => {
    const fbref = faqtsRef(faqref)
    fbref.on('child_added', snap => {
      const faqt = fbToFaqt(faqref, snap) 
      dispatch(FAQTS.addFaqt(faqt))
      FULLTEXT.addFaqt(faqt)
    })
    fbref.on('child_changed', snap => {
      const faqt = fbToFaqt(faqref, snap)
      // const uiFaqt = getState().ui.faqt
      dispatch(FAQTS.replaceFaqt(faqt))
      FULLTEXT.updateFaqt(faqt)
      // if(uiFaqt && uiFaqt.id === faqt.id) dispatch(updateUI({faqtId:faqt.id}))
    })
    fbref.on('child_removed', snap => {
      console.log('child removed happened')
    })
  }
}
export function updateOneFaqt(faqt, text, draftjs) {
  return firebase.database().ref().update({
    [faqtTextPath(faqt)]: text,
    [faqtDraftjsPath(faqt)]: draftjs,
    [faqtUpdatedPath(faqt)]: Date.now()
  })
}
export function openFaq(faqref) {
  return function(dispatch, getState) {
    const {faqs} = getState()
    const faq = faqs.find(faq => _.isEqual(faq, faqref))
    if(!faq) {
      dispatch(initFaqts(faqref))  // load the faq and its faqts from firebase
      dispatch(ADDFAQ(faqref))   // add the faq to the store
    }
    return faqref
  }
}
export function closeFaq(faqref) {
  return function(dispatch, getState) {
    const state = getState()
    const {uid} = state.ui
    denit(faqtsRef(faqref),'child_added','child_changed')
    SELECT.getFaqtKeysByFaqref(state, faqref).forEach(key => FULLTEXT.removeFaqtByKey(key))
    dispatch(REMFAQ(faqref))  // purges all affected faqts and scores
  }
}

function closeOne() {

}

export function initFirebase() {
  return function(dispatch, getState) {
    console.log('initing firebase')
    dispatch(handleSearchRequest(''))
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        const {uid} = user
        dispatch(updateUI({uid, index:FULLTEXT.FULLTEXT}))
        const faqrefTest = dispatch(openFaq({uid, faqId:'work'}))
        const faqrefDefault = dispatch(openFaq({uid, faqId: 'default'}))
        const perfaqtHelp = dispatch(openFaq({uid:'perfaqt', faqId: 'help', isRO:true}))
      }
      else getState().faqs.forEach(faqref => dispatch(closeFaq(faqref)))
    })
    const dbRefBroadcast = firebase.database().ref().child('broadcast')
    dbRefBroadcast.on('value', snap => dispatch(updateUI({broadcast:snap.val()})))
  }
}
export function setNextFocus(nextFocus) {
  return (dispatch, getState) => {
    switch(nextFocus) {
      case 'SEARCH': return dispatch(updateUI({faqtId:null, focused:'SEARCH'}))
      case 'nothing': return dispatch(updateUI({faqtId:null, focused:null}))
    }
  }
}
export const saveTagsToFB = (faqt, tags) => {
  return dispatch => faqt.tags === tags ? null : firebase.database().ref().update({[faqtTagsPath(faqt)]: tags})
}

function buildNewFaqt(faqref) {
  const now = Date.now()
  return {
    faqref, 
    id: UNIQ.randomId(4),
    text:'',
    draftjs: {},
    created: now,
    updated: now
  }
}

function faqtToFaqtFB(faqt) {
  var copy = Object.assign({}, faqt)
  delete copy.faqref
  return copy
} 
export function addFaqt({uid, faqId, isRO}) {
  return function(dispatch, getState) {
    const {search:{text,scores=[]}} = getState().ui
    if(isRO) return
    const faqt = buildNewFaqt({uid, faqId})
    const faqtKey = faqtToKey(faqt)
    firebase.database().ref(faqtPath(faqt)).set(faqtToFaqtFB(faqt))
    .then(() => {
      dispatch(updateUI({focused:faqt.id, faqtKey})) // get that out of the way
      dispatch(saveSearchWithScores({ text, scores:[faqtKey, ...scores] }))
    })
  }
}
export const signup = (email, password) => (dispatch, getState, {fbauth}) => {
  fbauth.createUserWithEmailAndPassword(email, password).catch(e => alert(e.message))
}
export const login = (email, password) => (dispatch, getState, {fbauth}) => {
  fbauth.signInWithEmailAndPassword(email, password)
  .catch(e => alert(e.message))
}
export const logout = () => dispatch => firebase.auth().signOut()
export const focusSearch = () => dispatch => dispatch(updateUI({focused:'SEARCH'}))
export const activateFaqt = faqtKey => dispatch => dispatch(updateUI({faqtKey,focused:faqtKey}))

function getActiveTags({faqts, ui}, faqtId) {
  if(!faqtId) return '';
  const faqt = faqts.find(item => item.id === faqtId)
  return faqt ? faqt.tags : ''
}

export function handleSearchRequest(text) {
  return function(dispatch, getState, {idb}) {
    const {uid, search} = getState().ui
    text = (text || '').toLowerCase()
    const SEARCHSTORE = idb.transaction('searches','readwrite').objectStore('searches')
    const req = SEARCHSTORE.get(text)
    req.onerror = e => {
      console.log('search for search returns error ', e)
      // SEARCHSTORE.add({text})
      // dispatch(updateUI({search:{text, scores:[]}}))
    }
    req.onsuccess = e => {
      let search = e.target.result
      if(search) return dispatch(updateUI({search:e.target.result}))
      SEARCHSTORE.add({text})
      dispatch(updateUI({search:{text, scores:[]}}))
    }
  }
}

export const logit = message => {
  return (dispatch, getState, whatever) => {
    console.log(message)
  }
}
export function getSuggestionsFromIDB(value) {
  return (dispatch, getState, {idb}) => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    if(!inputLength) return dispatch(updateUI({searchSuggestions:[]}))
    const reqGetall = idb.transaction('searches').objectStore('searches').getAll()
    reqGetall.onerror = e => console.log('error', e)
    reqGetall.onsuccess = e => {
      const searchSuggestions = e.target.result
      .filter(({text}) => text.slice(0,inputLength).toLowerCase() === inputValue)
      .map(search => search.text)
      dispatch(updateUI({searchSuggestions}))
    }
  }
}


