import $ from 'jquery'
import _ from 'lodash'
import {Entity} from 'draft-js'
import * as UNIQ from '@trystal/uniq-ish'
import * as SELECT from './select'
import * as FAQTS from './faqts/faqts-actions'
import * as SEARCHES from './searches/searches-actions'
import * as SCORES from './scores/scores-actions'
import * as FULLTEXT from './fulltext'
import {updateUI, addFaq as ADDFAQ, removeFaq as REMFAQ} from './reducer'

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
const scoreValuePath = (uid, score) => scorePropPath(score,'value')

const searchesPath = uid => `/users/${uid}/searches`
const searchesRef = uid => FBDATA.ref().child(searchesPath(uid))
const searchPath = (uid,id) => `${searchesPath(uid)}/${id}`
const searchPropPath = (uid, search, propname) => `${searchPath(uid, search.id)}/${propname}`
const searchTextPath = (uid, search) => searchPropPath(uid, search, 'text')

//
//     -- users / $UID / scores / $FAQID / $SCOREID / {FAQTID, SEARCHID, SCORE}
//            -- OPENING FAQ subscribes to /users/BOB/scores/FAQREF/[SCORE, SCORE, SCORE]
//            -- IF A FAQT DIES, THEN WE JUST DELETE ALL SCORES WITH A MATCHING FAQTID
//            -- IF A SEARCH DIES, THEN DELETE ALL SCORES WITH MATHING SEARCHID
//

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
  }
}
function initSearches(uid) {
  return (dispatch, getState) => {
    const fbref = searchesRef(uid) 
    fbref.on('child_added', snap => {
      const search = { 
        id: snap.key, 
        text: snap.val().text 
      }
      dispatch(SEARCHES.addSearch(search))
    })
    fbref.on('child_changed', snap => console.log(snap.key, snap.val()))
  }
}
function initScores(uid, faqref) {
  return (dispatch,getState) => {
    const fbref = scoresRef(uid, faqref)
    fbref.on('child_added', snap => {
      const {faqtId, searchId, value} = snap.val()
      dispatch(SCORES.addScore({ faqref, id: snap.key, searchId, faqtId, value }))
    })
    fbref.on('child_changed', snap => dispatch(SCORES.updateScore(faqref, snap.key, {value:snap.val().value})))
    fbref.on('child_removed', snap => dispatch(SCORES.deleteScore({faqref, id:snap.key})))
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
    dispatch(initFaqts(faqref))
    dispatch(initScores(getState().ui.uid, faqref))
    dispatch(ADDFAQ(faqref))
    return faqref
  }
}
export function closeFaq(faqref) {
  return function(dispatch, getState) {
    const state = getState()
    const {uid} = state.ui
    denit(faqtsRef(faqref),'child_added','child_changed')
    denit(scoresRef(uid, faqref), 'child_added', 'child_changed', 'child_removed')
    SELECT.getFaqtsByFaqref(state, faqref).forEach(faqt => FULLTEXT.removeFaqt(faqt))
    dispatch(REMFAQ(faqref))  // purges all affected faqts and scores
  }
}
export function firebaseStuff(app, auth, db) {
  FBAUTH = auth
  FBDATA = db
  return  function(dispatch, getState) {
    auth.onAuthStateChanged(user => {
      if(user) {
        const {uid} = user
        dispatch(updateUI({uid, index:FULLTEXT.FULLTEXT}))
        dispatch(initSearches(uid))
        const faqrefTest = dispatch(openFaq({uid, faqId:'work'}))
        const faqrefDefault = dispatch(openFaq({uid, faqId: 'default'}))
        const perfaqtHelp = dispatch(openFaq({uid:'perfaqt', faqId: 'help', isRO:true}))
        dispatch(setActiveFaq(faqrefDefault))
      }
      else {
        dispatch(updateUI({faq:null, uid:null}))
        const isPrivate = () => true
        getState().faqs
        .filter(faq => isPrivate())
        .forEach(faqref => dispatch(closeFaq(faqref)))
      }
    })
    const dbRefBroadcast = db.ref().child('broadcast')
    dbRefBroadcast.on('value', snap => dispatch(updateUI({broadcast:snap.val()})))
  }
}
export function setSearch(text) {
  return function(dispatch, getState) {
    if(!text) return dispatch(updateUI({search:{id:null, text:null}}))
    let search = SELECT.findSearchByText(getState(), text)
    if(!search) search = {id:null, text}
    dispatch(updateUI({search}))
  }
}


function createScore(uid, searchId, faqtId, value) {
  const id = UNIQ.randomId(4)
  const path = scorePath(uid, {id})
  const scoreFB = { searchId, faqtId, value }
  FBDATA.ref(path).set(scoreFB)
}
export function setBestFaqt(faqt) {
  return function(dispatch, getState, extras) {
    const state = getState()
    const {uid, search} = state.ui
    if(!search.id) {
      const {text} = search
      if(!text) {
        // const promise = updateFaqtRank(faqt)   // <=== this doesn't work either; FUDGE
        return
      }
      search.id = UNIQ.randomId(4)
      FBDATA.ref(searchTextPath(uid, search)).set(text)
      .then(() => dispatch(updateUI({search})))
    }
    const matchingScore = SELECT.findScore(state, search, faqt)
    const bestScore = SELECT.findBestScore(state, search)
    const alreadyBest = matchingScore && matchingScore === bestScore
    if(alreadyBest) return

    const value = bestScore ? bestScore.value + 1 : 1
    if(matchingScore) FBDATA.ref().update({[scoreValuePath(uid, matchingScore)]: value})
    else createScore(uid, search.id, faqt.id, value) 
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
export function addFaqt() {
  return function(dispatch, getState) {
    const state = getState()
    const {uid, faqref, search} = state.ui

    function getSearchId(text) {
      if(!text || !text.length) return null
      const search = SELECT.findSearchByText(state, text)
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
      if(search && search.text) {
        if(!search.id) {
          search.id = UNIQ.randomId(4)
          if(typeof search.text === 'object') throw 'search.text cannot be an object in addSearch'
          FBDATA.ref(searchTextPath(uid, search)).set(search.text)
        }
        const scoreFB = { 
          searchId:search.id, 
          faqtId, 
          value: getScoreValue(search)
        }
        FBDATA.ref(scorePath(uid, {faqref, id:UNIQ.randomId(4)})).set(scoreFB)
      }
      dispatch(updateUI({focused:faqtId, faqtId}))
    })
  }
}
// why not one-note
// one node is a product you have to buy from Microsoft
export function saveSearch() {
  return function(dispatch, getState) {
    const {uid, search:{id,text}} = getState().ui
    if(id || !text) return
    const search = {
      id: UNIQ.randomId(4),
      text
    }
    FBDATA.ref(searchTextPath(uid,search)).set(search.text)
    .then(() => dispatch(updateUI({search})))
  }
}
export const updateFaqtRank = faqt => FBDATA.ref().update({[faqtRankPath(faqt)]: Date.now()})
export const signup = (email, password) => () => FBAUTH.createUserWithEmailAndPassword(email, password).catch(e => alert(e.message))
export const login = (email, password) => () => FBAUTH.signInWithEmailAndPassword(email, password).catch(e => alert(e.message))
export const logout = () => dispatch => FBAUTH.signOut()

export const focusSearch = () => dispatch => dispatch(updateUI({focused:'SEARCH'}))
export const deleteScore = score => () => FBDATA.ref(scorePath(score)).remove()
export const setActiveFaq = faqref => dispatch => dispatch(updateUI({faqref, search:{faqref, id:null, text:null}}))
export const activateFaqt = ({id,tags}) => dispatch => dispatch(updateUI({faqtId:id,focused:id}))

export const saveActiveField = () => {
  return (dispatch, getState) => {
    const {ui:{activeField:{fldName, tmpValue}}} = getState()
    if(!fldName) return
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
function getActiveTags({faqts, ui}, faqtId) {
  if(!faqtId) return '';
  const faqt = faqts.find(item => item.id === faqtId)
  return faqt ? faqt.tags : ''
}
function getTmpValue(state, {fldName,objectId}) {
  if(!fldName) return null
  switch(fldName) {
    case 'fldLink':return getActiveLink(state);
    case 'fldTags': return getActiveTags(state, objectId);
    default: return ''
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




