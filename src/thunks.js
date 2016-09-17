import $ from 'jquery'
import _ from 'lodash'
import {Entity} from 'draft-js'
import * as UNIQ from '@trystal/uniq-ish'
import * as SELECT from './select'
import * as FAQTS from './faqts/faqts-actions'
import * as SEARCHES from './searches/searches-actions'
import * as SCORES from './scores/scores-actions'
import {updateUI, addFaq as ADDFAQ} from './reducer'
import lunr  from 'lunr'
import databases,{dbForFaqref} from './fulltext'

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

const scoresPath = faqref => `scores/${faqPath(faqref)}`
const scoresRef = faqref => FBDATA.ref().child(scoresPath(faqref))
const scorePath = ({faqref, id}) => `${scoresPath(faqref)}/${id}`
const scorePropPath = (score, propname) => `${scorePath(score)}/${propname}`
const scoreSearchIdPath = score => scorePropPath(score,'searchId')
const scoreValuePath = score => scorePropPath(score,'value')

const searchesPath = faqref => `searches/${faqPath(faqref)}`
const searchesRef = faqref => FBDATA.ref().child(searchesPath(faqref))
const searchPath = ({faqref,id}) => `${searchesPath(faqref)}/${id}`
const searchPropPath = (search, propname) => `${searchPath(search)}/${propname}`
const searchTextPath = search => searchPropPath(search, 'text')

function remapScoreSearchIds(faqref, searches, scores) {
  const {uid, faqId} = faqref
  const {key, remaps} = searches.reduce(({key, remaps}, {text,id}) => {
    text = text.toLowerCase().trim()
    const existing = key[text.toLowerCase()]
    if(!key[text]) key[text] = id
    else remaps[id] = existing
    return {key, remaps}
  }, {key:{}, remaps:{}})
  const badScores = scores.filter(score => remaps[score.searchId])
  const updates = {}
  badScores.forEach(badScore => updates[scoreSearchIdPath(badScore)] = remaps[badScore.searchId])
  Object.keys(remaps).forEach(badSearchId => updates[searchPath(faqref, badSearchId)] = null)
  console.log(updates)
  //FBDATA.ref().update(updates)
}
function initFaqts(dispatch, getState, faqref) {
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
    dbForFaqref(faqref).add(faqt)
  })
  fbref.on('child_changed', snap => {
    const {ui:{faqt:uiFaqt}} = getState()
    const {text, draftjs, tags, created, rank, updated} = snap.val()
    const faqt = { faqref, id: snap.key, text, draftjs, tags, rank, updated, created }
    dispatch(FAQTS.replaceFaqt(faqt))
    dbForFaqref(faqref).update(faqt)
    if(uiFaqt && uiFaqt.id === faqt.id) dispatch(updateUI({faqtId:faqt.id}))
  })
}
function initSearches(dispatch, faqref) {
  const fbref = searchesRef(faqref) 
  fbref.on('child_added', snap => {
    const search = { 
      faqref, 
      id: snap.key, 
      text: snap.val().text 
    }
    dispatch(SEARCHES.addSearch(search))
  })
  fbref.on('child_changed', snap => {
    console.log(faqref.faqId, snap.key, snap.val().faqts)
  })
}
function initScores(dispatch, faqref) {
  const fbref = scoresRef(faqref)
  fbref.on('child_added', snap => {
    const {faqtId, searchId, value} = snap.val()
    dispatch(SCORES.addScore({ faqref, id: snap.key, searchId, faqtId, value }))
  })
  fbref.on('child_changed', snap => dispatch(SCORES.updateScore(faqref, snap.key, {value:snap.val().value})))
  fbref.on('child_removed', snap => dispatch(SCORES.deleteScore({faqref, id:snap.key})))
}
function initFullText(dispatch, faqref) {
  const {uid, faqId} = faqref
  const dbkey = `${uid}-${faqId}`
  databases[dbkey] = lunr(function () {
    this.field('text')
    this.field('tags',{boost:100})
    this.ref('id')
  })
  dispatch(updateUI({index:databases[dbkey]}))
}
function updateOneFaqt(faqt, text, draftjs) {
  return FBDATA.ref().update({
    [faqtTextPath(faqt)]: text,
    [faqtDraftjsPath(faqt)]: draftjs,
    [faqtUpdatedPath(faqt)]: Date.now()
  })
}
export function closeItDown() {
}
export function openFaq(faqref) {
  return function(dispatch, getState) {
    initFaqts(dispatch, getState, faqref)
    initSearches(dispatch, faqref)
    initScores(dispatch, faqref)
    initFullText(dispatch, faqref)   // this should be shut down when auth state changes; massive hole
    dispatch(ADDFAQ(faqref))
    return faqref
  }
}
export function firebaseStuff(app, auth, db) {
  FBAUTH = auth
  FBDATA = db
  return  function(dispatch, getState) {
    auth.onAuthStateChanged(user => {
      if(user) {
        const {uid} = user
        dispatch(updateUI({uid}))
        const faqrefTest = dispatch(openFaq({uid, faqId:'work'}))
        const faqrefDefault = dispatch(openFaq({uid, faqId: 'default'}))
        dispatch(setActiveFaq(faqrefDefault))
      }
      else dispatch(updateUI({faq:null, uid:null}))
    })
    const dbRefBroadcast = db.ref().child('broadcast')
    dbRefBroadcast.on('value', snap => dispatch(updateUI({broadcast:snap.val()})))
  }
}
export function setSearch(faqref, text) {
  return function(dispatch, getState) {
    if(!text) return dispatch(updateUI({search:{faqref, id:null, text:null}}))
    let search = SELECT.findSearchByText(getState(), faqref, text)
    if(!search) search = {faqref, id:null, text}
    dispatch(updateUI({search}))
  }
}

export function cleanUp() {
  return (dispatch, getState, extras) => {
    const {searches, scores, ui:{faqref}} = getState()
    remapScoreSearchIds(faqref, searches, scores)
  } 
}
export function setBestFaqt(faqref, faqt) {
  return function(dispatch, getState, extras) {
    const state = getState()
    const {search} = state.ui
    const {uid, faqId} = faqref

    if(!search.id) {
      const {text} = search
      if(!text) {
        const promise = updateFaqtRank(faqt)
        return
      }
      search.id = UNIQ.randomId(4)
      FBDATA.ref(searchTextPath(search)).set(text)
      .then(() => dispatch(updateUI({search})))
    }
    const matchingScore = SELECT.findScore(state, search, faqt)
    const bestScore = SELECT.findBestScore(state, search)
    if(matchingScore && matchingScore === bestScore) return
    const value = bestScore ? bestScore.value + 1 : 1

    if(matchingScore) FBDATA.ref().update({[scoreValuePath(matchingScore)]: value})
    else FBDATA.ref(scorePath({faqref, id:UNIQ.randomId(4)})).set({ searchId:search.id, faqtId:faqt.id, value })
  }  
}

export function updateFaqt(faqt, text, draftjs, nextFocus) {
  return function(dispatch, getState) {
    const {faqref,id:faqtId} = faqt
    const state = getState()
    if(!SELECT.getFaqt(state, faqref, faqtId)) return
    const promise = updateOneFaqt(faqt, text, draftjs)
    if(!nextFocus) return
    switch(nextFocus) {
      case 'SEARCH': return dispatch(updateUI({faqtId:null, focused:'SEARCH'}))
      case 'nothing': return dispatch(updateUI({faqtId:null, focused:null}))
    }
    return promise
  }
}
export function updateTags(faqt, tags) {
  return function(dispatch, getState) {
    const {faqref:{uid,faqId}, id:faqtId} = faqt
    var updates = {}
    updates[faqtTagsPath(faqt)] = tags
    FBDATA.ref().update(updates)
    dispatch(updateUI({focused:'SEARCH'}))
  }
}
export function addFaqt(search) {
  return function(dispatch, getState) {
    const state = getState()
    if(!search) return
    const {faqref,faqref:{uid,faqId}} = search

    function getSearchId(text) {
      if(!text || !text.length) return null
      const search = SELECT.findSearchByText(state, faqref, text)
      return search ? search.id : null
    }
    function getScoreValue(search) {
      const score = SELECT.findBestScore(state, search)
      return score ? score.value + 1 : 1
    }
    const faqtId = UNIQ.randomId(4)
    const created = Date.now()
    const rank = created
    FBDATA.ref(faqtPath({faqref,id:faqtId})).set({text:'', draftjs:{}, created, rank})
    .then(() => {
      if(search.text) {
        if(!search.id) {
          search.id = UNIQ.randomId(4)
          if(typeof search.text === 'object') throw 'search.text cannot be an object in addSearch'
          FBDATA.ref(searchTextPath(search)).set(search.text)
        }
        const fbScore = { 
          searchId:search.id, 
          faqtId, 
          value: getScoreValue(search)
        }
        FBDATA.ref(scorePath({faqref, id:UNIQ.randomId(4)})).set(fbScore)
      }
      dispatch(updateUI({focused:faqtId, faqtId}))
    })
  }
}
export function saveSearch(faqref, text) {
  return function(dispatch, getState) {
    if(!text || !text.length) return
    const state = getState()
    let search = SELECT.findSearchByText(state, faqref, text)
    if(search && search.id) return dispatch(updateUI({search}))
    search = {
      id: UNIQ.randomId(4),
      faqref, text
    }
    const {uid,faqId} = faqref
    FBDATA.ref(searchTextPath(search)).set(search.text)
    .then(() => dispatch(updateUI({search})))
  }
}
export const updateFaqtRank = faqt => FBDATA.ref().update({[faqtRankPath(faqt)]: Date.now()})
export const signup = (email, password) => () => FBAUTH.createUserWithEmailAndPassword(email, password).catch(e => alert(e.message))
export const login = (email, password) => () => FBAUTH.signInWithEmailAndPassword(email, password).catch(e => alert(e.message))
export const logout = () => dispatch => FBAUTH.signOut()

export const focusSearch = () => dispatch => dispatch(updateUI({focused:'SEARCH'}))
export const deleteScore = score => () => FBDATA.ref(scorePath(score)).remove()
export const activateFaqt = ({id,tags}) => dispatch => dispatch(updateUI({faqtId:id,focused:id,fldTags:tags}))
export const setActiveFaq = faqref => dispatch => dispatch(updateUI({faqref, search:{faqref, id:null, text:null}}))

export const saveActiveField = () => {
  return (dispatch, getState) => {
    const {ui:{activeField:{fldName, tmpValue}}} = getState()
    if(!fldName) return
    console.log(`do something with ${tmpValue} for field ${fldName}`)
  }
}
export const resetActiveField = () => {
  return (dispatch, getState) => {
    const {ui:{activeField:{fldName, tmpValue}}} = getState()
    dispatch(updateUI({activeField:{fldName, tmpValue:''}}))
  }
}
export const updateActiveField = tmpValue => {
  return (dispatch, getState) => {
    const {ui:{activeField:{fldName}}} = getState()
    dispatch(updateUI({activeField:{fldName, tmpValue}}))
  }
}
function getActiveLink({ui:{editorState}}) {
  if(!editorState) return ''
  const {focusKey, focusOffset} = editorState.getSelection()
  const block = editorState.getCurrentContent().blockMap.get(focusKey)
  const entityKey = block.getEntityAt(focusOffset)
  if(!entityKey) return ''
  const {type, mutability, data} = Entity.get(entityKey)
  return type === 'LINK' ? data.href : ''
}

function getTmpValue(state, fldName) {
  if(!fldName) return null
  if(fldName !== 'fldLink') return ''
  return getActiveLink(state)
}

export const setActiveField = fldName => {
  return (dispatch, getState) => {
    dispatch(saveActiveField())
    const tmpValue = getTmpValue(getState(), fldName)
    dispatch(updateUI({activeField:{fldName, tmpValue}}))
  }
}
export const toggleActiveField = fldName => {
  return (dispatch, getState) => {
    dispatch(saveActiveField())
    const isShowing = fldName === getState().ui.activeField.fldName
    dispatch(setActiveField(isShowing ? null : fldName))
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




