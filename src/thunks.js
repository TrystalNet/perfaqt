import $ from 'jquery'
import _ from 'lodash'
import * as xxx from 'lodash'
import {Entity} from 'draft-js'
import * as UNIQ from '@trystal/uniq-ish'
import * as SELECT from './select'
import * as FAQTS from './faqts/faqts-actions'
import * as FULLTEXT from './fulltext'
import {updateUI, addFaq as ADDFAQ, removeFaq as REMFAQ} from './reducer'

const faqtToKey = SELECT.faqtToKey

let IDB

function setIDB(idb) {
  return dispatch => {
    IDB = idb
    dispatch(handleSearchRequest(''))
  }
}

let FBAUTH
let FBDATA
const faqPath = ({uid, faqId}) => `${uid}/${faqId}`

const faqtsPath = faqref => `faqts/${faqPath(faqref)}`
const faqtsRef = faqref => FBDATA.ref().child(faqtsPath(faqref))
const faqtPath = ({faqref, id}) => `${faqtsPath(faqref)}/${id}`
const faqtPropPath = (faqt, propname) => `${faqtPath(faqt)}/${propname}`
const faqtTagsPath = faqt => faqtPropPath(faqt,'tags')
const faqtTextPath = faqt => faqtPropPath(faqt,'text')
const faqtDraftjsPath = faqt => faqtPropPath(faqt,'draftjs')
const faqtUpdatedPath = faqt => faqtPropPath(faqt,'updated')
const faqtRankPath = faqt => faqtPropPath(faqt,'rank')

const scoresPath = (uid,faqref) => `/users/${uid}/scores/${faqPath(faqref)}`  
const scoresRef = (uid, faqref) => FBDATA.ref().child(scoresPath(uid, faqref))
const scorePath = (uid, {faqref, id}) => `${scoresPath(uid, faqref)}/${id}`
const scorePropPath = (uid, score, propname) => `${scorePath(uid, score)}/${propname}`
const scoreSearchIdPath = (uid,score) => scorePropPath(uid, score,'searchId')
const scoreValuePath = (uid, score) => scorePropPath(uid, score,'value')

const searchesPath = uid => `/users/${uid}/searches`
const searchesRef = uid => FBDATA.ref().child(searchesPath(uid))
const searchPath = (uid,id) => `${searchesPath(uid)}/${id}`
const searchPropPath = (uid, {id}, propname) => `${searchPath(uid, id)}/${propname}`
const searchTextPath = (uid, search) => searchPropPath(uid, search, 'text')

const saveSearchWithScores = search => dispatch => {
  if(!search) return
  const putreq = IDB.transaction('searches','readwrite').objectStore('searches').put(search)
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
function initFaqts(faqref) {
  return (dispatch, getState) => {
    const fbref = faqtsRef(faqref)
    let defaultTime = new Date(2016,1,1).getTime()  // temporary solution to support legacy faqts
    fbref.on('child_added', snap => {
      const {text, draftjs, tags, rank, created, updated} = snap.val()
      const whenCreated = created || defaultTime++
      const whenUpdated = updated || whenCreated
      const faqt = { 
        faqref, id: snap.key, 
        text, draftjs, tags,
        rank,  
        created:whenCreated, 
        updated: whenUpdated 
      }
      dispatch(FAQTS.addFaqt(faqt))
      FULLTEXT.addFaqt(faqt)
    })
    fbref.on('child_changed', snap => {
      const {ui:{faqt:uiFaqt}} = getState()
      const {text, draftjs, tags, created, rank, updated} = snap.val()
      const faqt = { faqref, id: snap.key, text, draftjs, tags, rank, updated, created }
      dispatch(FAQTS.replaceFaqt(faqt))
      FULLTEXT.updateFaqt(faqt)
      if(uiFaqt && uiFaqt.id === faqt.id) dispatch(updateUI({faqtId:faqt.id}))
    })
    fbref.on('child_removed', snap => {
      console.log('child removed happened')
    })
  }
}
function updateOneFaqt(faqt, text, draftjs) {
  return FBDATA.ref().update({
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

function openidb(name,ver) {
  return new Promise(function(yes, no) {
    var req = indexedDB.open(name, ver)
    req.onupgradeneeded = function(res) {
      no(req)
      no.onsuccess = null
    }
    req.onsuccess = function(res) {
      yes(res.result)
    }
    req.onblocked = no
  })
}

export function openDatabases(app, auth, fbdb) {
  return (dispatch, getState) => {
    const req = window.indexedDB.open('perfaqt', 17)
    req.onsuccess = function(event) {
      dispatch(setIDB(this.result))
      // IDB = this.result
      dispatch(firebaseStuff(app, auth, fbdb))
    } // use this to avoid issues with garbage collection
    req.onError = e => console.error('openDb:', e.target.errorCode)
    req.onupgradeneeded = function(e) {
      const idb = e.target.result
      // var x = e.currentTarget.result
      if(idb.objectStoreNames.contains('scores')) idb.deleteObjectStore('scores')
      if(idb.objectStoreNames.contains('answers')) idb.deleteObjectStore('answers')
      if(idb.objectStoreNames.contains('questions')) idb.deleteObjectStore('questions')
      if(!idb.objectStoreNames.contains('searches')) idb.createObjectStore('searches', {keyPath:'text'})
      console.log('idb updated')
      // IDB = idb
      dispatch(setIDB(idb))
      dispatch(firebaseStuff(app, auth, fbdb))
    }
  }
}

function firebaseStuff(app, auth, db) {
  FBAUTH = auth
  FBDATA = db
  return  function(dispatch, getState) {
    dispatch(handleSearchRequest(''))
    auth.onAuthStateChanged(user => {
      if(user) {
        const {ui} = getState()
        const {uid} = user
        dispatch(updateUI({uid, index:FULLTEXT.FULLTEXT}))
        const faqrefTest = dispatch(openFaq({uid, faqId:'work'}))
        const faqrefDefault = dispatch(openFaq({uid, faqId: 'default'}))
        const perfaqtHelp = dispatch(openFaq({uid:'perfaqt', faqId: 'help', isRO:true}))
        dispatch(setActiveFaq(faqrefDefault))
      }
      else {
        dispatch(updateUI({faq:null, uid:null}))
        const isPrivate = () => true
        getState().faqs
        .filter(faq => isPrivate())  // whaaaa?
        .forEach(faqref => dispatch(closeFaq(faqref)))
      }
    })
    const dbRefBroadcast = db.ref().child('broadcast')
    dbRefBroadcast.on('value', snap => dispatch(updateUI({broadcast:snap.val()})))
  }
}
export function logState() {
  return function(dispatch, getState) {
    console.log(getState())
  }
}
export function updateFaqt(faqtKey, text, draftjs, nextFocus) {
  return function(dispatch, getState) {
    const faqt = getState().faqts.get(faqtKey)
    if(!faqt) return
    const {faqref,id:faqtId} = faqt
    const promise = updateOneFaqt(faqt, text, draftjs)
    if(!nextFocus) return
    switch(nextFocus) {
      case 'SEARCH': return dispatch(updateUI({faqtId:null, focused:'SEARCH'}))
      case 'nothing': return dispatch(updateUI({faqtId:null, focused:null}))
    }
    return promise
  }
}
export function saveTagsToFB(faqt, tags) {
    if(faqt.tags !== tags) FBDATA.ref().update({[faqtTagsPath(faqt)]: tags})
}
function buildNewFaqt(faqref) {
  return {
    faqref, 
    id: UNIQ.randomId(4),
    text:'',
    draftjs: {},
    created: Date.now()
  }
}
function faqtToFaqtFB(faqt) {
  var copy = Object.assign({}, faqt)
  delete copy.faqref
  return copy
} 
export function addFaqt() {
  return function(dispatch, getState) {
    const {faqref,search:{text,scores=[]}} = getState().ui
    const faqt = buildNewFaqt(faqref)
    const faqtKey = faqtToKey(faqt)
    FBDATA.ref(faqtPath(faqt)).set(faqtToFaqtFB(faqt))
    .then(() => {
      dispatch(updateUI({focused:faqt.id, faqtId:faqt.id})) // get that out of the way
      dispatch(saveSearchWithScores({ text, scores:[faqtKey, ...scores] }))
    })
  }
}
export const signup = (email, password) => () => FBAUTH.createUserWithEmailAndPassword(email, password).catch(e => alert(e.message))
export const login = (email, password) => () => FBAUTH.signInWithEmailAndPassword(email, password).catch(e => alert(e.message))
export const logout = () => dispatch => FBAUTH.signOut()
export const focusSearch = () => dispatch => dispatch(updateUI({focused:'SEARCH'}))
export const setActiveFaq = faqref => dispatch => dispatch(updateUI({faqref}))
export const activateFaqt = faqtKey => dispatch => dispatch(updateUI({faqtKey,focused:faqtKey}))

function getActiveLink({ui:{editorState}}) {
  if(!editorState) return ''
  const {focusKey, focusOffset} = editorState.getSelection()
  const block = editorState.getCurrentContent().blockMap.get(focusKey)
  const entityKey = block.getEntityAt(focusOffset)
  if(!entityKey) return ''
  const {type, mutability, data} = Entity.get(entityKey)
  return type === 'LINK' ? data.href : ''
}
function getActiveTags({faqts, ui}, faqtId) {
  if(!faqtId) return '';
  const faqt = faqts.find(item => item.id === faqtId)
  return faqt ? faqt.tags : ''
}
function getTmpValue(state, {fldName,objectId}) {
  if(!fldName) return null
  switch(fldName) {
    case 'fldLink': return getActiveLink(state);
    case 'fldTags': return objectId.tags;
    case 'fldSearch': return state.ui.search.text || ''
    default: return '';
  }
}
export function handleSearchRequest(text) {
  return function(dispatch, getState) {
    const {uid, search} = getState().ui
    text = (text || '').toLowerCase()
    const SEARCHSTORE = IDB.transaction('searches','readwrite').objectStore('searches')
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
export const saveActiveField = () => {
  return (dispatch, getState) => {
    const state = getState()
    const {faqts, ui, ui:{activeField:{fldName, objectId, tmpValue}}} = state
    if(!fldName) return
    switch(fldName) {
      case 'fldTags': return saveTagsToFB(faqts.get(objectId), tmpValue)
      case 'fldSearch' : return dispatch(handleSearchRequest(tmpValue))
      default: throw `no luck saving ${tmpValue} into ${fldName}`
    }
  }
}
export const resetActiveField = () => {
  return (dispatch, getState) => {
    const {ui:{activeField:{fldName, objectId}}} = getState()
    const tmpValue = getTmpValue(getState(), {fldName,objectId} )
    dispatch(updateUI({activeField:{fldName, objectId, tmpValue:''}}))
  }
}
export const updateActiveField = (tmpValue) => {
  return (dispatch, getState) => {
    const {ui:{activeField:{fldName, objectId}}} = getState()
    dispatch(updateUI({activeField:{fldName, objectId, tmpValue}}))
  }
}
export const setActiveField = ({fldName, objectId}) => {
  return (dispatch, getState) => {
    dispatch(saveActiveField())
    const tmpValue = getTmpValue(getState(), {fldName,objectId})
    dispatch(updateUI({activeField:{fldName, objectId, tmpValue}}))
  }
}
export const toggleActiveField = fldName => {
  return (dispatch, getState) => {
    dispatch(saveActiveField())
    const isShowing = fldName === getState().ui.activeField.fldName
    dispatch(setActiveField({fldName:isShowing ? null : fldName}))
  }
}
export const setDraftjs = editorState => {
  return (dispatch, getState) => {
    dispatch(updateUI({editorState}))
  }
}
export const logit = message => {
  return (dispatch, getState, whatever) => {
    console.log(message)
  }
}
export function getSuggestionsFromIDB(value) {
  return dispatch => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    if(!inputLength) return dispatch(updateUI({searchSuggestions:[]}))
    const reqGetall = IDB.transaction('searches').objectStore('searches').getAll()
    reqGetall.onerror = e => console.log('error', e)
    reqGetall.onsuccess = e => {
      const searchSuggestions = e.target.result
      .filter(({text}) => text.slice(0,inputLength).toLowerCase() === inputValue)
      .map(search => search.text)
      dispatch(updateUI({searchSuggestions}))
    }
  }
}


