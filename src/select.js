import {maxBy, orderBy, isEqual} from 'lodash'
import {FULLTEXT} from './fulltext'

export const faqToKey = ({uid,faqId}) => `${uid}/${faqId}`
export const faqtToKey = ({faqref,id}) => `${faqToKey(faqref)}/${id}`
export const scoreToFaqtKey = ({faqref,faqtId}) => faqtToKey({faqref,id:faqtId})

export const faqrefIdMatch = (a,b) => a.id === b.id &&  isEqual(a.faqref,b.faqref)

export const getFaqtKeysByFaqref = (state, faqref)  => {
  if(!faqref || !state.faqts) return [] 
  const faqKey = faqToKey(faqref) + '/'  
  return state.faqts.keys().filter(key => key.startsWith(faqKey))
}

export const getFaqt = (state, faqref, id) => state.faqts.get(faqtToKey({faqref,id}))

export const getFaqts = state => state.faqts
export const getSearches = state => state.searches || []

export const getScores = state => [...state.scores.values()]  // here is the question....
export const getScoresBySearch = (state, search) => getScores(state).filter(score => score.searchId === search.id)

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

function getMatchingScores(state, search) {
  const scores = getScoresBySearch(state, search)
  return orderBy(scores, 'value', 'desc')                              
}

const scoresToFaqts = (state, scores) => scores.map(score => state.faqts.get(scoreToFaqtKey(score)))     
export const getBestFaqtByRank = (state, faqref)  => maxBy(getFaqts(state), 'rank') || null
export const findBestScore = (state, search) => (search && search.text) ? maxBy(getScoresBySearch(state, search), 'value') || null : null

function allFaqtsByRank(state) {
  const faqts = [...getFaqts(state).values()]
  faqts.sort((a,b) => (b.rank || 0) - (a.rank || 0))
  return faqts// return faqts
}

function faqtsForSavedSearch(state, search) {
  const faqtsByScore = scoresToFaqts(state, getMatchingScores(state, search))
  const faqtsFromFullText = FULLTEXT.search(search.text).map(({ref,score}) => state.faqts.get(ref))
  const faqtsByRank = allFaqtsByRank(state)
  return [...(new Set([...faqtsByScore, ...faqtsFromFullText, ...faqtsByRank]))]
}
export function findScore(state, search, faqt) {
  // used when showing a faqt, to show the best button with associated score and delete-score buttons 
  if(!faqt || !faqt.id || !search || !search.id) return null
  const result = getScores(state)
  .filter(score => score.searchId === search.id && isEqual(score.faqref, faqt.faqref))
  .find(score => score.faqtId === faqt.id) // max 1 match for faqt+search combo
  return result;
}


export function getFaqtsForSearch(state, search) {
  if(!search) return []
  const {id, text} = search
  let result = []
  if(id) result = faqtsForSavedSearch(state, search)
  else result = allFaqtsByRank(state)
  return result.slice(0,10)
}
export function findSearchByText(state, text) {
  if(!text) return null
  text = text.toLowerCase()
  return getSearches(state).find(search => text === search.text.toLowerCase())
}



