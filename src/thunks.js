import $ from 'jquery'
import _ from 'lodash'
import * as UNIQ from '@trystal/uniq-ish'
import * as SELECT from './select'
import * as FAQTS from './faqts/faqts-actions'
import * as SEARCHES from './searches/searches-actions'
import * as SCORES from './scores/scores-actions'
import * as UI from './ui/ui-actions'
import lunr  from 'lunr'
import databases from './fulltext'

let FBAUTH
let FBDATA
const faqtsPath = (uid,faqId) => `faqts/${uid}/${faqId}`
const faqtsRef = (uid, faqId) => FBDATA.ref().child(faqtsPath(uid, faqId))

function initFaqts(dispatch, faqId) {
  const fbref = faqtsRef(FBAUTH.currentUser.uid, faqId)
  let defaultTime = new Date(2016,1,1).getTime()  // temporary solution to support legacy faqts
  fbref.on('child_added', snap => {
    const {text, draftjs, tags, created} = snap.val()
    const when = created || defaultTime++
    const faqt = { faqId, id: snap.key, text, draftjs, tags, created:when }
    dispatch(FAQTS.addFaqt(faqt))
    databases[faqId].add(faqt)
  })
  fbref.on('child_changed', snap => {
    const {text, draftjs, tags, created} = snap.val() 
    const faqt = { faqId, id: snap.key, text, draftjs, tags, created }
    dispatch(FAQTS.updateFaqt(faqId, snap.key, {text, draftjs, tags}))
    databases[faqId].update(faqt)
  })
}
function initSearches(dispatch, faqId) {
  const uid = FBAUTH.currentUser.uid
  const path = `searches/${uid}/${faqId}`
  const fbref = FBDATA.ref().child(path)
  fbref.on('child_added', snap => {
    const fbSearch = snap.val()
    const text = fbSearch.text
    const search = { faqId, id: snap.key, text }
    dispatch(SEARCHES.addSearch(search))
  })
  fbref.on('child_changed', snap => {
    console.log(faqId, snap.key, snap.val().faqts)
  })
}
function initScores(dispatch, faqId) {
  const uid = FBAUTH.currentUser.uid
  const fbref = FBDATA.ref().child(`scores/${uid}/${faqId}`)
  fbref.on('child_added', snap => {
    const {faqtId, searchId, value} = snap.val()
    const score = { faqId, id: snap.key, searchId, faqtId, value }
    dispatch(SCORES.addScore(score))
  })
  fbref.on('child_changed', snap => dispatch(SCORES.updateScore(faqId, snap.key, {value:snap.val().value})))
  fbref.on('child_removed', snap => dispatch(SCORES.deleteScore(faqId, snap.key)))
}
function initFullText(dispatch, faqId) {
  databases[faqId] = lunr(function () {
    this.field('text')
    this.field('tags',{boost:100})
    this.ref('id')
  })
  dispatch(UI.setIndex(databases[faqId]))
}
function updateOneFaqt(faqId, faqtId, text, draftjs) {
  const uid = FBAUTH.currentUser.uid
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
export function firebaseStuff(app, auth, db) {
  FBAUTH = auth
  FBDATA = db
  return  function(dispatch, getState) {
    // FBAUTH.currentUser.uid   !!!!
    const faqId = getState().ui.faqId
    auth.onAuthStateChanged(user => {
      if(user) {
        dispatch(UI.setConnected(true))
        initFaqts(dispatch, faqId)
        initSearches(dispatch, faqId)
        initScores(dispatch, faqId)
        initFullText(dispatch, faqId)   // this should be shut down when auth state changes; massive hole
      }
      else dispatch(UI.setConnected(false))
    })
    const dbRefBroadcast = db.ref().child('broadcast')
    dbRefBroadcast.on('value', snap => dispatch(UI.setBroadcast(snap.val())))
  }
}
export function setSearch(text) {
  return function(dispatch, getState) {
    if(!text) return dispatch(UI.setSearch(null))
    const state = getState()
  const {faqId} = state.ui
    let search = SELECT.findSearchByText(state, faqId, text)
    if(!search) search = {faqId, id:null, text}
    dispatch(UI.setSearch(search))
  }
}
export function activateFaqt(faqId, faqtId) {
  return function(dispatch) {
    dispatch(UI.setFocused(faqtId))
    dispatch(UI.setFaqtId(faqtId))
  }
}
export function focusSearch() {
  return function(dispatch) {
    dispatch(UI.setFocused('SEARCH'))
  }
}
export function setBestFaqt(faqId, faqtId) {
  return function(dispatch, getState, extras) {
    const uid = FBAUTH.currentUser.uid
    const state = getState()
    const {search} = state.ui
    if(!search) return

    if(!search.id) {
      const {text} = search
      if(!text) return
      search.id = UNIQ.randomId(4)
      FBDATA.ref(`searches/${uid}/${faqId}/${search.id}/text`).set(text)
      .then(() => dispatch(UI.setSearch(search)))
    }
    const matchingScore = SELECT.findScore(state, faqId, search.id, faqtId)
    const bestScore = SELECT.findBestScore(state, faqId, search.id)
    if(matchingScore && matchingScore === bestScore) return
    const value = bestScore ? bestScore.value + 1 : 1

    if(matchingScore) {
      var updates = {}
      updates[`scores/${uid}/${faqId}/${matchingScore.id}/value`] = value
      FBDATA.ref().update(updates)
    }
    else FBDATA.ref(`scores/${uid}/${faqId}/${UNIQ.randomId(4)}`).set({ searchId:search.id, faqtId, value })
  }  
}
export function updateTags(faqId, faqtId, tags) {
  return function(dispatch, getState) {
    const uid = FBAUTH.currentUser.uid
    var updates = {}
    updates[`faqts/${uid}/${faqId}/${faqtId}/tags`] = tags
    FBDATA.ref().update(updates)
    dispatch(UI.setFocused('SEARCH'))
  }
}
export function updateFaqt(faqId, faqtId, text, draftjs, nextFocus) {
  return function(dispatch, getState) {
    const state = getState()
    if(!SELECT.getFaqtById(state, faqId, faqtId)) return
    updateOneFaqt(faqId, faqtId, text, draftjs)
    if(!nextFocus) return
    switch(nextFocus) {
      case 'SEARCH': 
        dispatch(UI.setFaqtId(null))
        dispatch(UI.setFocused('SEARCH'))
        return
      case 'nothing': 
        dispatch(UI.setFaqtId(null))
        dispatch(UI.setFocused(null))
        return 
    }
  }
}
export function saveTags(faqtId, tags) {
  return function(dispatch, getState) {
    const state = getState()
    const {faqId} = state.ui
    if(!SELECT.getFaqtById(state, faqId, faqtId)) return
    updateOneFaqt(faqId, faqtId, tags)
  }
}
export function addFaqt() {
  return function(dispatch, getState) {
    const state = getState()
    const uid = FBAUTH.currentUser.uid
    const {faqId} = state.ui

    function getSearchId(text) {
      if(!text || !text.length) return null
      const search = SELECT.findSearchByText(state, faqId, text)
      return search ? search.id : null
    }
    function getScoreValue(searchId) {
      const score = SELECT.findBestScore(state, faqId, searchId)
      return score ? score.value + 1 : 1
    }
    const faqtId = UNIQ.randomId(4)
    const created = Date.now()
    FBDATA.ref(`faqts/${uid}/${faqId}/${faqtId}`).set({text:'', draftjs:{}, created})
    .then(() => {
      const search = SELECT.getSearch(state)
      if(search && search.text) {
        if(!search.id) {
          search.id = UNIQ.randomId(4)
          if(typeof search.text === 'object') throw 'search.text cannot be an object in addSearch'
          FBDATA.ref(`searches/${uid}/${faqId}/${search.id}/text`).set(search.text)
        }
        const scoreId = UNIQ.randomId(4)
        const value = getScoreValue(search.id)
        FBDATA.ref(`scores/${uid}/${faqId}/${scoreId}`).set({ searchId:search.id, faqtId, value })
      }
      dispatch(UI.setFocused(faqtId))
      dispatch(UI.setFaqtId(faqtId))
    })
  }
}
export function saveSearch(text) {
  return function(dispatch, getState) {
    if(!text || !text.length) return
    const state = getState()
    const {faqId} = state.ui
    let search = SELECT.findSearchByText(state, faqId, text)
    if(search && search.id) return dispatch(UI.setSearch(search))
    search = {
      faqId,
      id: UNIQ.randomId(4),
      text
    }
    const uid = FBAUTH.currentUser.uid
    const path = `searches/${uid}/${faqId}/${search.id}/text`
    FBDATA.ref(path).set(search.text)
    .then(() => dispatch(UI.setSearch(search)))
  }
}
export function deleteScore(scoreId) {
  return function(dispatch, getState) {
    const uid = FBAUTH.currentUser.uid
    const {faqId} = getState().ui
    const path = `scores/${uid}/${faqId}/${scoreId}`
    FBDATA.ref(path).remove()
  }
}
//============== ^^^ checked for faqId support =====================//
//============== vvv work in progress ==============================//
    // to here vvv //
    // to here ^^^ //
//============== ^^^ work in progress ==============================//
//============== vvv not so much ===================================//

