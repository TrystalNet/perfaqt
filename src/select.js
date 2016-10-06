import {maxBy, orderBy, isEqual} from 'lodash'
import {FULLTEXT} from './fulltext'

export const faqToKey = ({uid,faqId}) => `${uid}/${faqId}`
export const faqtToKey = ({faqref,id}) => `${faqToKey(faqref)}/${id}`

export const faqrefIdMatch = (a,b) => a.id === b.id &&  isEqual(a.faqref,b.faqref)

export const getFaqtKeysByFaqref = (state, faqref)  => {
  if(!faqref || !state.faqts) return [] 
  const faqKey = faqToKey(faqref) + '/'  
  return [...state.faqts.keys()].filter(key => key.startsWith(faqKey))
}

export const getFaqtByKey = (state, faqtKey) => state.faqts.get(faqtKey)
export const getFaqt = (state, faqref, id) => getFaqtByKey(state, faqtToKey({faqref,id}))

export const getFaqts = state => state.faqts
export const getSearches = state => state.searches || []

export const getScores = state => [...state.scores.values()]  // here is the question....

export const getActiveFaqref = state => state.ui.faqref  // where new faqts will be added
export const getActiveFaqtKey = state => state.ui.faqtKey // could be in any faq
export const getActiveSearch = state => state.ui.search


// the question is, what it does it mean that there is one active faqref
// from a search standpoint this is meaningless, since several faqs are searchable simultaneously
// but from an update standpoint, not so much
// sometimes there will not be an updatable search; in that case, continues to be meaningless
// so, say I have three faq going at the same time; there has to be an indicator for that
// so the states for a faq are now:
// hot, warm, cold, detached
// hot is editing, there can only be one 

export const getBestFaqtByRank = (state, faqref)  => maxBy(getFaqts(state), 'rank') || null

function allFaqtsByDate(state) {
  const faqts = [...getFaqts(state).values()]
  faqts.sort((a,b) => (a.created || 0) - (b.created || 0))
  return faqts// return faqts
}

export const findBestScore = search => search && search.scores && search.scores[0] ? search.scores[0] : 0

export function findScoreNOSEARCH(state, faqt) {
  if(!faqt) return null
  const result = getScores(state)
  .filter(score => !score.searchId && isEqual(score.faqref, faqt.faqref))
  .find(score => score.faqtId === faqt.id) // max 1 match for faqt+search combo
  return result;
}

export function findScore(state, faqt, search) {
  // used when showing a faqt, to show the best button with associated score and delete-score buttons 
  if(!faqt) return null
  if(!search || !search.id) return findScoreNOSEARCH(state, faqt)
  const result = getScores(state)
  .filter(score => score.searchId === search.id && isEqual(score.faqref, faqt.faqref))
  .find(score => score.faqtId === faqt.id) // max 1 match for faqt+search combo
  return result;
}

const addFaqtKeysToSet = (set, src, fn, faqts, pageSize=10) => {
  if(set.size >= pageSize) return
  src.slice(0, pageSize).forEach(item => {
    const faqtKey = fn ? fn(item) : item
    if(set.size < pageSize && faqts.get(faqtKey)) set.add(faqtKey)    
  })
}

export function faqtKeyToIsRO(faqtKey) {
} 


// some of the search scores may belong to faqts that don't exist for various reasons
export function getFaqtKeysForSearch(state) {
  const MAX = 10
  const {ui, faqts} = state
  const {text='', scores=[]} = ui.search
  const result = new Set()
  addFaqtKeysToSet(result, scores, null, faqts, MAX)
  addFaqtKeysToSet(result, FULLTEXT.search(text), match => match.ref, faqts, MAX)
  addFaqtKeysToSet(result, allFaqtsByDate(state), faqt => faqtToKey(faqt), faqts, MAX)
  return [...result] // convert set back to an array
}
export function findSearchByText(state, text) {
  if(!text) return null
  text = text.toLowerCase()
  return getSearches(state).find(search => text === search.text.toLowerCase())
}
export const getFaqtKeyScore = (faqt, search={}) => search.scores ? search.scores.indexOf(faqt) : -1
export const getFaqtScore = (faqt, search={}) => getFaqtKeyScore(faqtToKey(faqt), search)


