import * as _ from 'lodash'
import {FULLTEXT} from './fulltext' 

export const getFaqtsByFaqref = (state, faqref)  => (faqref && state.faqts) ? state.faqts.filter(faqt => _.isEqual(faqt.faqref, faqref)) : []

export const getFaqt = (state, faqref, id) => getFaqtsByFaqref(state, faqref).find(faqt => faqt.id === id)

export const getFaqts = state => state.faqts || []
export const getSearches = state => state.searches || []

export const getScores = state => state.scores || []  // here is the question....
export const getScoresBySearch = (state, {id}) => getScores(state).filter(score => score.searchId === id)

export const getActiveFaqtId = state => state.ui.faqtId
export const getActiveSearch = state => state.ui.search
export const getActiveFaqref = state => state.ui.faqref

// the question is, what it does it mean that there is one active faqref
// from a search standpoint this is meaningless, since several faqs are searchable simultaneously
// but from an update standpoint, not so much
// sometimes there will not be an updatable search; in that case, continues to be meaningless
// so, say I have three faq going at the same time; there has to be an indicator for that
// so the states for a faq are now:
// hot, warm, cold, detached
// hot is editing, there can only be one 


function getMatchingScores(state, {id}) {
  const scores = state.scores.filter(score => score.id === id)
  return _.orderBy(scores, 'value', 'desc')                              
}

function getScoredFaqts(state, {id}) {
  const FAQTS = getFaqts(state)  // get all the faqts in play 
  const matchingScores = getMatchingScores(state, {id}) // find scores that map                  
  return new Set(matchingScores.map(({faqref, id}) => FAQTS.find(faqt => faqt.id === id && _.isEqual(faqref, faqt.faqref))))    
}

function faqtsForSavedSearch(state, search) {
  const {id, text} = search
  return getFaqts(state).map(faqt => faqt)
  // const mymap = new Map()
  // return faqts
  // getFaqts.forEach(faqt => {
  //   mymap.set(faqt)
  // })
  // const scoreFAQTS = getScoredFaqts(state, search) // find scores that map
  // scoreFAQTS.forEach(score)                  
  // const FAQTS = getFaqts(state)  // get all the faqts in play
  // let map = new Map()
  // const ftextFAQTS = FULLTEXT.search(text).map(({faqt}) => faqt) 
  // // faqtids is not enough up there; we need  
  // // here we want to merge all the search dbs into one

  // const allFAQTIDS = _.map(getFaqtsByFaqref(state, faqref), 'id')
  // const nonBestFAQTIDS = _.difference(allFAQTIDS, bestFAQTIDS)
  // const unranked = _.difference(nonBestFAQTIDS, ftFAQTIDS)

  // const faqtIndex = _.keyBy(FAQTS, 'id')

  // const faqts1 = bestFAQTIDS.map(id => faqtIndex[id])
  // const faqts2 = ftFAQTIDS.map(id => faqtIndex[id])
  // const faqts3 = unranked.map(id => faqtIndex[id])

  // faqts3.sort((a,b) => (b.rank || 0) - (a.rank || 0))

  // return [...faqts1, ...faqts2, ...faqts3]
}
function faqtsForSearchText(state, search) {
  return getFaqts(state).map(faqt => faqt)
  
  // const {faqref, text} = search
  // const ftIndex = dbForFaqref(faqref)

  // const faqts = getFaqtsByFaqref(state, faqref)
  // const faqtIndex = _.keyBy(faqts, 'id')
  // const allFAQTIDS = _.map(getFaqtsByFaqref(state, faqref), 'id')
  // const ftFAQTIDS = ftIndex ? ftIndex.search(text).map(item => item.ref) : []
  // const unranked = _.difference(allFAQTIDS, ftFAQTIDS)
  // const faqts1 = ftFAQTIDS.map(id => faqtIndex[id])
  // const faqts2 = unranked.map(id => faqtIndex[id])
  // faqts2.sort((a,b) => (b.rank || 0) - (a.rank || 0))
  // return [...faqts1, ...faqts2]
}
function faqtsForNoText(state, faqref) {
  const faqts = [...getFaqts(state)]
  faqts.sort((a,b) => (b.rank || 0) - (a.rank || 0))
  return faqts// return faqts
}
export function findScore(state, search, faqt) {
  // used when showing a faqt, to show the best button with associated score and delete-score buttons 
  if(!faqt || !faqt.id || !search || !search.id) return null
  const result = getScores(state)
  .filter(score => score.searchId === search.id && _.isEqual(score.faqref, faqt.faqref))
  .find(score => score.faqtId === faqt.id) // max 1 match for faqt+search combo
  return result;
}
export function getBestFaqtByRank(state, faqref) {
  return _.maxBy(getFaqts(state), 'rank') || null
}
export function findBestScore(state, search) {
  if(!search || !search.text) return null
  return _.maxBy(getScoresBySearch(search), 'value') || null
}
export function getFaqtsForSearch(state, search) {
  if(!search) return []
  const {id, text} = search
  let result = []
  if(id) result = faqtsForSavedSearch(state, search)
  else if(text) result = faqtsForSearchText(state, search)
  else result = faqtsForNoText(state)
  return result.slice(0,10)
}
export function findSearchByText(state, text) {
  if(!text) return null
  text = text.toLowerCase()
  return getSearches(state).find(search => text === search.text.toLowerCase())
}
