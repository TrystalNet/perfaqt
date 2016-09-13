import * as _ from 'lodash'
import ftdbs, {dbForFaqref} from './fulltext' 

export const getSearchesByFaqref = (state, faqref) => faqref ? state.searches.filter(search => _.isEqual(search.faqref, faqref)) : []
export const getFaqtsByFaqref = (state, faqref)    => faqref ? state.faqts.filter(faqt => _.isEqual(faqt.faqref, faqref)) : []
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
  return [...bestFAQTIDS,...ftFAQTIDS, ...unranked].map(id => faqtIndex[id])
}
function faqtsForSearchText(state, search) {
  const {faqref, text} = search
  const ftIndex = dbForFaqref(faqref)

  const faqts = getFaqtsByFaqref(state, faqref)
  const faqtIndex = _.keyBy(faqts, 'id')
  const allFAQTIDS = _.map(getFaqtsByFaqref(state, faqref), 'id')
  const ftFAQTIDS = ftIndex ? ftIndex.search(text).map(item => item.ref) : []
  const unranked = _.difference(allFAQTIDS, ftFAQTIDS)
  return [...ftFAQTIDS, ...unranked].map(id => faqtIndex[id])
}
function faqtsForNoText(state, faqref) {
  const faqts = [...getFaqtsByFaqref(state, faqref)]
  faqts.sort((a,b) => b.created - a.created)
  return faqts
}
export function findScore(state, search, faqt) {
  // used when showing a faqt, to show the best button with associated score and delete-score buttons 
  if(!faqt || !faqt.id || !search || !search.id) return null
  console.log('looking for score')
  
  const result = getScoresByFaqref(state, search.faqref)
  .filter(score => score.searchId === search.id)
  .find(score => score.faqtId === faqt.id) // max 1 match for faqt+search combo
  return result;
}
export function findBestScore(state, search) {
  const {faqref, id} = search
  const matches = getScoresByFaqref(state, faqref).filter(score => score.searchId === id)
  switch(matches.length) {
    case 0: return null
    case 1: return matches[0]
  }
  return matches.reduce((accum, item) => {
    const accumValue = accum.value || 0
    const itemValue = item.value || 0
    return itemValue > accumValue ? item : accum
  })
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

