import $ from 'jquery'
import _ from 'lodash'
import * as UNIQ from '@trystal/uniq-ish'
import * as SELECT from './select'
import * as FAQTS from './faqts/faqts-actions'
import * as SEARCHES from './searches/searches-actions'
import * as SCORES from './scores/scores-actions'
import * as UI from './ui/ui-actions'
import lunr  from 'lunr'

let FBAUTH
let FBDATA
let FULLTEXT

const FAQID = 'default'

function initFullText(dispatch) {
  FULLTEXT = lunr(function () {
    this.field('text')
    this.field('tags',{boost:100})
    this.ref('id')
  })
  dispatch(UI.setIndex(FULLTEXT))
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
function initFaqts(dispatch, faqId) {
  const uid = FBAUTH.currentUser.uid
  const path = `faqts/${uid}/${faqId}`
  const fbref = FBDATA.ref().child(path)
  fbref.on('child_added', snap => {
    const {text, draftjs, tags} = snap.val()
    const faqt = { id: snap.key, text, draftjs, tags }
    dispatch(FAQTS.addFaqt(faqt))
    FULLTEXT.add(faqt)
  })
  fbref.on('child_changed', snap => {
    const {text, draftjs, tags} = snap.val() 
    const faqt = { id: snap.key, text, draftjs, tags }
    dispatch(FAQTS.updateFaqt(snap.key, {text, draftjs, tags}))
    FULLTEXT.update(faqt)
  })
}
function initSearches(dispatch, faqId) {
  const uid = FBAUTH.currentUser.uid
  const path = `searches/${uid}/${faqId}`
  const fbref = FBDATA.ref().child(path)
  fbref.on('child_added', snap => {
    const fbSearch = snap.val()
    const search = {
      id: snap.key,
      text:fbSearch.text
    }
    dispatch(SEARCHES.addSearch(search))
  })
  fbref.on('child_changed', snap => {
    console.log(snap.key, snap.val().faqts)
  })
}
function initScores(dispatch, faqId) {
  const uid = FBAUTH.currentUser.uid
  const fbref = FBDATA.ref().child(`scores/${uid}/${faqId}`)
  fbref.on('child_added', snap => {
    const {faqtId, searchId, value} = snap.val()
    const score = { id: snap.key, searchId, faqtId, value }
    dispatch(SCORES.addScore(score))
  })
  fbref.on('child_changed', snap => dispatch(SCORES.updateScore(snap.key, {value:snap.val().value})))
}
export function firebaseStuff(app, auth, db) {
  FBAUTH = auth
  FBDATA = db
  return  function(dispatch, getState) {
    // FBAUTH.currentUser.uid   !!!!
    auth.onAuthStateChanged(user => {
      if(user) {
        dispatch(UI.setConnected(true))
        initFaqts(dispatch, FAQID)
        initSearches(dispatch, FAQID)
        initScores(dispatch, FAQID)
      }
      else dispatch(UI.setConnected(false))
    })
    const dbRefBroadcast = db.ref().child('broadcast')
    dbRefBroadcast.on('value', snap => dispatch(UI.setBroadcast(snap.val())))

    initFullText(dispatch)

  }
}
export function doSearch(search) {
  return function(dispatch) {
    dispatch(UI.setSearch(search) )
  }
}
export function activateFaqt(faqtId) {
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
export function setBestFaqt(faqtId) {
  return function(dispatch, getState, extras) {
    const uid = FBAUTH.currentUser.uid
    const state = getState()
    const search = state.ui.search
    if(!search || !search.length) return

    let searchId
    const Q = SELECT.findSearchByText(state, search)
    if(Q) searchId = Q.id
    else {
      searchId = UNIQ.randomId(4)
      FBDATA.ref(`searches/${uid}/${FAQID}/${searchId}`).set({text:search})
    }

    const matchingScore = SELECT.findScore(state, searchId, faqtId)
    const bestScore = SELECT.findBestScore(state, searchId)
    if(matchingScore && matchingScore === bestScore) return

    const value = bestScore ? bestScore.value + 1 : 1

    if(matchingScore) {
      var updates = {}
      updates[`scores/${uid}/${FAQID}/${matchingScore.id}/value`] = value
      FBDATA.ref().update(updates)
    }
    else FBDATA.ref(`scores/${uid}/${FAQID}/${UNIQ.randomId(4)}`).set({ searchId, faqtId, value })
  }  
}

function updateOneFaqt(faqtId, text, draftjs) {
  const uid = FBAUTH.currentUser.uid
  var updates = {}
  updates[`faqts/${uid}/${FAQID}/${faqtId}/text`] = text
  updates[`faqts/${uid}/${FAQID}/${faqtId}/draftjs`] = draftjs
  FBDATA.ref().update(updates)
}

export function updateTags(faqtId, tags) {
  return function(dispatch, getState) {
    const uid = FBAUTH.currentUser.uid
    var updates = {}
    updates[`faqts/${uid}/${FAQID}/${faqtId}/tags`] = tags
    FBDATA.ref().update(updates)
  }
}

export function updateFaqt(faqtId, text, draftjs, nextFocus) {
  return function(dispatch, getState) {
    if(!SELECT.getFaqtById(getState(), faqtId)) return
    updateOneFaqt(faqtId, text, draftjs)
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
    if(!SELECT.getFaqtById(getState(), faqtId)) return
    updateOneFaqt(faqtId, tags)
  }
}


export function addFaqt() {
  return function(dispatch, getState) {
    const state = getState()
    const uid = FBAUTH.currentUser.uid

    function getSearchId(text) {
      if(!text || !text.length) return null
      const search = SELECT.findSearchByText(state, text)
      return search ? search.id : null
    }
    function getScoreValue(searchId) {
      const score = SELECT.findBestScore(state, searchId)
      return score ? score.value + 1 : 1
    }
    const faqtId = UNIQ.randomId(4)
    FBDATA.ref(`faqts/${uid}/${FAQID}/${faqtId}`).set({text:'', draftjs:{}})

    const search = state.ui.search
    if(!search) return
    let searchId = getSearchId(search)
    if(!searchId) {
      searchId = UNIQ.randomId(4)
      FBDATA.ref(`searches/${uid}/${FAQID}/${searchId}`).set({text:search})
    }
    const scoreId = UNIQ.randomId(4)
    const value = getScoreValue(searchId)
    FBDATA.ref(`scores/${uid}/${FAQID}/${scoreId}`).set({ searchId, faqtId, value })      

    dispatch(UI.setFocused(faqtId))
    dispatch(UI.setFaqtId(faqtId))
  }
}
export function saveSearch(search) {
  return function(dispatch, getState) {
    const state = getState()
    if(SELECT.findSearchByText(state, search)) return
    const uid = FBAUTH.currentUser.uid
    const id = UNIQ.randomId(4)
    const path = `searches/${uid}/${FAQID}/${id}`
    FBDATA.ref(path).set({text:search})
  }
}

// now we need to add the full text search functionality back into the mix.....

