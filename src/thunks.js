import $ from 'jquery'
import _ from 'lodash'
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
const faqtsPath = (uid,faqId) => `faqts/${uid}/${faqId}`
const faqtsRef = (uid, faqId) => FBDATA.ref().child(faqtsPath(uid, faqId))

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
  badScores.forEach(badScore => updates[`scores/${uid}/${faqId}/${badScore.id}/searchId`] = remaps[badScore.searchId])
  Object.keys(remaps).forEach(badSearchId => updates[`searches/${uid}/${faqId}/${badSearchId}`] = null)
  console.log(updates)
  //FBDATA.ref().update(updates)
}

function initFaqts(dispatch, faqref) {
  const {uid, faqId} = faqref
  const fbref = faqtsRef(uid, faqId)
  let defaultTime = new Date(2016,1,1).getTime()  // temporary solution to support legacy faqts
  fbref.on('child_added', snap => {
    const {text, draftjs, tags, created} = snap.val()
    const when = created || defaultTime++
    const faqt = { faqref, id: snap.key, text, draftjs, tags, created:when }
    dispatch(FAQTS.addFaqt(faqt))
    dbForFaqref(faqref).add(faqt)
  })
  fbref.on('child_changed', snap => {
    const {text, draftjs, tags, created} = snap.val()
    const faqt = { faqref, id: snap.key, text, draftjs, tags, created }
    dispatch(FAQTS.replaceFaqt(faqt))
    dbForFaqref(faqref).update(faqt)
  })
}
function initSearches(dispatch, faqref) {
  const {uid, faqId} = faqref
  const fbref = FBDATA.ref().child(`searches/${uid}/${faqId}`)
  fbref.on('child_added', snap => {
    const fbSearch = snap.val()
    const text = fbSearch.text
    const search = { faqref, id: snap.key, text }
    dispatch(SEARCHES.addSearch(search))
  })
  fbref.on('child_changed', snap => {
    console.log(faqId, snap.key, snap.val().faqts)
  })
}
function initScores(dispatch, faqref) {
  const{uid, faqId} = faqref
  const fbref = FBDATA.ref().child(`scores/${uid}/${faqId}`)
  fbref.on('child_added', snap => {
    const {faqtId, searchId, value} = snap.val()
    const score = { faqref, id: snap.key, searchId, faqtId, value }
    dispatch(SCORES.addScore(score))
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
function updateOneFaqt(faqref, faqtId, text, draftjs) {
  const {uid, faqId} = faqref
  var updates = {}
  updates[`faqts/${uid}/${faqId}/${faqtId}/text`] = text
  updates[`faqts/${uid}/${faqId}/${faqtId}/draftjs`] = draftjs
  FBDATA.ref().update(updates)
}

export function login(email, password) {
  return function(dispatch, getState) {
    FBAUTH.signInWithEmailAndPassword(email, password)
    .catch(e => alert(e.message))
  }
}
export function signup(email, password) {
  return function(dispatch, getState) {
    FBAUTH.createUserWithEmailAndPassword(email, password)
    .catch(e => alert(e.message))
  }
}
export function logout() {
  return function(dispatch, getState) {
    FBAUTH.signOut()
  }
}
export function closeItDown() {
}

export function openFaq(faqref) {
  return function(dispatch) {
    initFaqts(dispatch, faqref)
    initSearches(dispatch, faqref)
    initScores(dispatch, faqref)
    initFullText(dispatch, faqref)   // this should be shut down when auth state changes; massive hole
    dispatch(ADDFAQ(faqref))
    return faqref
  }
}

export function setActiveFaq(faqref) {
  return function(dispatch) {
    const search = {faqref, id:null, text:null}
    const action = updateUI({faqref, search})
    dispatch(action)
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
      else {
        dispatch(updateUI({faq:null}))
        dispatch(updateUI({uid:null}))
      }
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
export function activateFaqt(faqt) {
  return function(dispatch) {
    const edits = {
      faqt, 
      focused:faqt.id, 
      fldTags:faqt.tags}
    dispatch(updateUI(edits))
  }
}
export function focusSearch() {
  return function(dispatch) {
    dispatch(updateUI({focused:'SEARCH'}))
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
    if(!search) return
    const {uid, faqId} = faqref

    if(!search.id) {
      const {text} = search
      if(!text) return
      search.id = UNIQ.randomId(4)
      FBDATA.ref(`searches/${uid}/${faqId}/${search.id}/text`).set(text)
      .then(() => dispatch(updateUI({search})))
    }
    const matchingScore = SELECT.findScore(state, search, faqt)
    const bestScore = SELECT.findBestScore(state, search)
    if(matchingScore && matchingScore === bestScore) return
    const value = bestScore ? bestScore.value + 1 : 1

    if(matchingScore) {
      var updates = {}
      updates[`scores/${uid}/${faqId}/${matchingScore.id}/value`] = value
      FBDATA.ref().update(updates)
    }
    else FBDATA.ref(`scores/${uid}/${faqId}/${UNIQ.randomId(4)}`).set({ searchId:search.id, faqtId:faqt.id, value })
  }  
}

export function updateFaqt(faqt, text, draftjs, nextFocus) {
  return function(dispatch, getState) {
    const {faqref,id:faqtId} = faqt
    const state = getState()
    if(!SELECT.getFaqt(state, faqref, faqtId)) return
    updateOneFaqt(faqref, faqtId, text, draftjs)
    if(!nextFocus) return
    switch(nextFocus) {
      case 'SEARCH': return dispatch(updateUI({faqtId:null, focused:'SEARCH'}))
      case 'nothing': return dispatch(updateUI({faqtId:null, focused:null}))
    }
  }
}
export function updateTags(faqt, tags) {
  return function(dispatch, getState) {
    const {faqref:{uid,faqId}, id:faqtId} = faqt
    var updates = {}
    updates[`faqts/${uid}/${faqId}/${faqtId}/tags`] = tags
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
    FBDATA.ref(`faqts/${uid}/${faqId}/${faqtId}`).set({text:'', draftjs:{}, created})
    .then(() => {
      if(search.text) {
        if(!search.id) {
          search.id = UNIQ.randomId(4)
          if(typeof search.text === 'object') throw 'search.text cannot be an object in addSearch'
          FBDATA.ref(`searches/${uid}/${faqId}/${search.id}/text`).set(search.text)
        }
        const scoreId = UNIQ.randomId(4)
        const value = getScoreValue(search)
        FBDATA.ref(`scores/${uid}/${faqId}/${scoreId}`).set({ searchId:search.id, faqtId, value })
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
    const path = `searches/${uid}/${faqId}/${search.id}/text`
    FBDATA.ref(path).set(search.text)
    .then(() => dispatch(updateUI({search})))
  }
}
export function deleteScore(score) {
  return function(dispatch, getState) {
    const {faqref} = score
    const {uid,faqId} = faqref
    const path = `scores/${uid}/${faqId}/${score.id}`
    FBDATA.ref(path).remove()
  }
}
//============== ^^^ checked for faqId support =====================//
//============== vvv work in progress ==============================//
    // to here vvv //
    // to here ^^^ //
//============== ^^^ work in progress ==============================//
//============== vvv not so much ===================================//

