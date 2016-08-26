import $ from 'jquery'
import * as UNIQ from '@trystal/uniq-ish'
import * as SELECT from './select'
import * as FAQTS from './faqts/faqts-actions'
import * as SEARCHES from './searches/searches-actions'
import * as SCORES from './scores/scores-actions'
import * as UI from './ui/ui-actions'

import lunr  from 'lunr'

export function saveSearch(search) {
  return function(dispatch, getState) {
    const state = getState()
    if(SELECT.findSearchByText(state, search)) return
    const id = UNIQ.randomId(4)
    const text = search
    dispatch(SEARCHES.addSearch({id, text}))
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
export function updateFaqt(faqtId, text) {
  return function(dispatch, getState) {
    const state = getState()
    const A = SELECT.getFaqtById(state, faqtId)
    if(!A) return
    dispatch(FAQTS.updateFaqt(faqtId, {text}))
    if(!state.isDirty) dispatch(UI.setIsDirty(true))
  }
}
export function addFaqt(text) {
  return function(dispatch, getState) {
    const state = getState()
    const existingFaqt = SELECT.findFaqtByText(state, text)
    if(existingFaqt) return
    const id = UNIQ.randomId(4) 
    dispatch(FAQTS.addFaqt({ id, text }))
  }
}

function buildFakeData(howMany=10) {
  function getFaqtText(i) {
    switch(i) {
      case 3: return 'Once upon a midnight dreary\nWhile I pondered weak and weary\nOver many a quaint and curious'
      case 5: return 'The rain in spain falls mainly in the plain.'
      case 10: return 'How about those blue jays?'
      default: return 'Faqt ' + i
    }
  }

  const searches = []
  const faqts = []
  const scores = []
  for(var i = 0; i < howMany; i++) {
    const searchId = 'q' + i
    const faqtId = 'a' + i
    const scoreId = 's' + i
    searches.push({id:searchId, text:'Search ' + i})
    faqts.push({id:faqtId, text:getFaqtText(i)})
    scores.push({id:scoreId, searchId, faqtId, value:1})
  }
  return {searches, faqts, scores}
}

export function save() { 
  return function(dispatch, getState) {
    const state = getState()
    if(state.ui.isDEVL) {
      dispatch(UI.setIsDirty(false))
      return
    }
    const upload = {
      faqts  : state.faqts,
      searches: state.searches,
      scores   : state.scores
    }
    $.ajax({
      type: 'PUT',
      contentType: 'application/json',
      url: `/save`,
      data: JSON.stringify(upload)
    })
    .done(result =>     dispatch(UI.setIsDirty(false)))
    .fail((a, textStatus, errorThrown) => alert('error occurred: ' + errorThrown))
}}


export function load() { 
  return function(dispatch, getState) {
    const state = getState()
    $.ajax({
      type: 'GET',
      contentType: 'application/json',
      url: `/load`
    })
    .done(data => {
      if(typeof data === 'string') {
        data = buildFakeData(50)
        dispatch(UI.setIsDEVL(true))
      }

      const index = lunr(function() {
        this.field('text')
        this.ref('id')
      })
      function convert(data) {
        return {
          searches: data.questions,
          faqts: data.answers,
          scores: data.scores.map(({id, score, qid, aid}) => ({id, score, searchId:qid, faqtId:aid}))
        }
      }
      if(data.answers) data = convert(data)
      data.faqts.forEach(faqt => index.add(faqt))
      dispatch(UI.setIndex(index))
      dispatch(SEARCHES.loadSearches(data.searches))
      dispatch(FAQTS.loadFaqts(data.faqts))
      dispatch(SCORES.loadScores(data.scores))
    })
    .fail((a, textStatus, errorThrown) => {
      dispatch(SEARCHES.loadSearches({}))
      dispatch(FAQTS.loadFaqts({}))
      dispatch(SCORES.loadScores({}))
      alert('loaded an empty faq to start')
    })
}}
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
      if(!state.ui.isDirty) dispatch(UI.setIsDirty(true))
    }
  }  
}

export function addFaqt() {
  return function(dispatch, getState) {
    const state = getState()
    function getSearchId(text) {
      if(!text || !text.length) return null
      const search = SELECT.findSearchByText(state, text)
      return search ? search.id : null
    }
    function getScoreValue(searchId) {
      const score = SELECT.findBestScore(state, searchId)
      return score ? score.value + 1 : 1
    }
    const searchId = getSearchId(state.ui.search)
    const faqtId = UNIQ.randomId(4)
    const newFaqt = { id:faqtId, text:'' }

    dispatch(FAQTS.addFaqt(newFaqt))
    if(searchId) {
      const score = {
        id: UNIQ.randomId(4),
        searchId, faqtId, 
        value:getScoreValue(searchId)
      }      
      dispatch(SCORES.addScore(score))
    }
     dispatch(UI.setFaqtId(faqtId))
 }
}