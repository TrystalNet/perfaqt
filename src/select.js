import * as _ from 'lodash'
import ftdbs, {dbForFaqref} from './fulltext' 

export const getSearchesByFaqref = (state, faqref) => faqref ? state.searches.filter(search => _.isEqual(search.faqref, faqref)) : []
export const getFaqtsByFaqref = (state, faqref)    => (faqref && state.faqts) ? state.faqts.filter(faqt => _.isEqual(faqt.faqref, faqref)) : []
export const getScoresByFaqref = (state, faqref)   => faqref ? state.scores.filter(score => _.isEqual(score.faqref, faqref)) : []
export const getFaqt = (state, faqref, id) => getFaqtsByFaqref(state, faqref).find(faqt => faqt.id === id)

export const getActiveFaqt = state => state.ui.faqt
export const getActiveSearch = state => state.ui.search
export const getActiveFaqref = state => state.ui.faqref

function faqtsForSavedSearch(state, search) {
  const {faqref, id, text} = search
  const FAQTS = getFaqtsByFaqref(state, faqref)
  const SCORES = getScoresByFaqref(state, faqref)
  const bestFAQTIDS = _.chain(SCORES)
    .filter(score => score.searchId === id)   
    .orderBy('value','desc')              
    .map(score => score.faqtId)              
    .value()                              

  const ftIndex = dbForFaqref(faqref)
  const ftFAQTIDS = ftIndex ? _.difference(ftIndex.search(text).map(item => item.ref), bestFAQTIDS) : []

  const allFAQTIDS = _.map(getFaqtsByFaqref(state, faqref), 'id')
  const nonBestFAQTIDS = _.difference(allFAQTIDS, bestFAQTIDS)
  const unranked = _.difference(nonBestFAQTIDS, ftFAQTIDS)

  const faqtIndex = _.keyBy(FAQTS, 'id')

  const faqts1 = bestFAQTIDS.map(id => faqtIndex[id])
  const faqts2 = ftFAQTIDS.map(id => faqtIndex[id])
  const faqts3 = unranked.map(id => faqtIndex[id])

  faqts3.sort((a,b) => (b.rank || 0) - (a.rank || 0))

  return [...faqts1, ...faqts2, ...faqts3]
}
function faqtsForSearchText(state, search) {
  const {faqref, text} = search
  const ftIndex = dbForFaqref(faqref)

  const faqts = getFaqtsByFaqref(state, faqref)
  const faqtIndex = _.keyBy(faqts, 'id')
  const allFAQTIDS = _.map(getFaqtsByFaqref(state, faqref), 'id')
  const ftFAQTIDS = ftIndex ? ftIndex.search(text).map(item => item.ref) : []
  const unranked = _.difference(allFAQTIDS, ftFAQTIDS)
  const faqts1 = ftFAQTIDS.map(id => faqtIndex[id])
  const faqts2 = unranked.map(id => faqtIndex[id])
  faqts2.sort((a,b) => (b.rank || 0) - (a.rank || 0))
  return [...faqts1, ...faqts2]
}
function faqtsForNoText(state, faqref) {
  const faqts = [...getFaqtsByFaqref(state, faqref)]
  faqts.sort((a,b) => (b.rank || 0) - (a.rank || 0))
  return faqts
}
export function findScore(state, search, faqt) {
  // used when showing a faqt, to show the best button with associated score and delete-score buttons 
  if(!faqt || !faqt.id || !search || !search.id) return null
  const result = getScoresByFaqref(state, search.faqref)
  .filter(score => score.searchId === search.id)
  .find(score => score.faqtId === faqt.id) // max 1 match for faqt+search combo
  return result;
}
export function getBestFaqtByRank(state, faqref) {
  return _.maxBy(getFaqtsByFaqref(state, faqref), 'rank') || null
}

export function findBestScore(state, search) {
  const {faqref, id:searchId} = search
  if(!search || !search.text) return null
  const matches = getScoresByFaqref(state, faqref).filter(score => score.searchId === searchId)
  return _.maxBy(matches, 'value') || null
}
export function getFaqtsForSearch(state, search) {
  if(!search || !search.faqref) return []
  const {faqref, id, text} = search
  let result = []
  if(id) result = faqtsForSavedSearch(state, search)
  else if(text) result = faqtsForSearchText(state, search)
  else result = faqtsForNoText(state, faqref)
  return result.slice(0,10)
}
export function findSearchByText(state, faqref, text) {
  if(!text) return null
  text = text.toLowerCase()
  return getSearchesByFaqref(state, faqref)
  .find(search => text === search.text.toLowerCase())
}

