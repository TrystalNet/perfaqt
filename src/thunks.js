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

function initFaqts(dispatch, uid, faqId) {
  const path = `faqts/${uid}/${faqId}`
  const fbref = FBDATA.ref().child(path)
  fbref.on('child_added', snap => {
    const faqt = {
      id: snap.key,
      text:snap.val().text
    }
    dispatch(FAQTS.addFaqt(faqt))
  })
  fbref.on('child_changed', snap => dispatch(FAQTS.updateFaqt(snap.key, {text:snap.val().text})))
}
function initSearches(dispatch, uid, faqId) {
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

function initScores(dispatch, uid, faqId) {
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
      if(user) dispatch(UI.setConnected(true))
      else dispatch(UI.setConnected(false))
    })
    const dbRefBroadcast = db.ref().child('broadcast')
    dbRefBroadcast.on('value', snap => dispatch(UI.setBroadcast(snap.val())))
    const uid = 'bob'
    const faqId = 'faq1'

    initFaqts(dispatch, uid, faqId)
    initSearches(dispatch, uid, faqId)
    initScores(dispatch, uid, faqId)
  }
}
export function doSearch(search) {
  return function(dispatch) {
    dispatch(UI.setSearch(search) )
  }
}
export function activateFaqt(faqtId) {
  return function(dispatch) {
    dispatch(UI.setFaqtId(faqtId))
  }
}
export function setBestFaqt(faqtId) {
  return function(dispatch, getState, extras) {
    const state = getState()
    const search = state.ui.search
    const Q = SELECT.findSearchByText(state, search)
    if(!Q) {
      alert('save search first')
      return // change this to create the search
    }
    let searchId = Q.id
    let matchingScore = SELECT.findScore(state, searchId, faqtId)
    let bestScore = SELECT.findBestScore(state, searchId)
    if(matchingScore && matchingScore === bestScore) return

    let value = bestScore ? bestScore.value + 1 : 1

    if(matchingScore) dispatch(SCORES.updateScore(matchingScore.id, {value}))
    else {
      const id = UNIQ.randomId(4)
      const score = { id, searchId, faqtId, value }
      dispatch(SCORES.addScore(score))
    }
  }  
}

export function updateFaqt(faqtId, text) {
  return function(dispatch, getState) {
    if(!SELECT.getFaqtById(getState(), faqtId)) return
    var updates = {}
    updates['faqts/bob/faq1/' + faqtId + '/text'] = text
    FBDATA.ref().update(updates)
  }
}



export function addFaqt() {
  return function(dispatch, getState) {
    // const state = getState()
    // function getSearchId(text) {
    //   if(!text || !text.length) return null
    //   const search = SELECT.findSearchByText(state, text)
    //   return search ? search.id : null
    // }
    // function getScoreValue(searchId) {
    //   const score = SELECT.findBestScore(state, searchId)
    //   return score ? score.value + 1 : 1
    // }
    // const searchId = getSearchId(state.ui.search)
    const faqtId = UNIQ.randomId(4)

    // dispatch(FAQTS.addFaqt(newFaqt))
    // if(searchId) {
    //   const score = {
    //     id: UNIQ.randomId(4),
    //     searchId, faqtId, 
    //     value:getScoreValue(searchId)
    //   }      
    //   dispatch(SCORES.addScore(score))
    // }

    FBDATA.ref('faqts/bob/faq1/' + faqtId).set({text:''})
  }
}
export function saveSearch(search) {
  return function(dispatch, getState) {
    const state = getState()
    if(SELECT.findSearchByText(state, search)) return
    const id = UNIQ.randomId(4)
    const faqId = 'faq1'
    const uid = 'bob'
    const path = `searches/${uid}/${faqId}/${id}`
    FBDATA.ref(path).set({text:search})
    // dispatch(SEARCHES.addSearch({id, text}))
  }
}

