import * as _ from 'lodash'
export const faqts = state => state.faqts
export const searches = state => state.searches 
export const scores = state => state.scores
export const fullTextIndex = state => state.ui.index
export const getSearch = state => state.ui.search

export const findFaqtByText   = (state, text) => faqts(state).find(A => A.text === text)
export const getFaqtById      = (state, id) => faqts(state).find(A => A.id === id)
 
function getEm(FAQTS, ids) {
  const FAQT_INDEX = _.keyBy(FAQTS, 'id')
  var result = ids.map(faqtId => FAQT_INDEX[faqtId])
  result = result.filter(item => item)
  return result
}
function faqtsForSearchIdAndText(state, search) {
  const {id, text} = search
  const SCORES = scores(state)
  const bestFAQTIDS = _.chain(SCORES)
    .filter(score => score.searchId === id)   
    .orderBy('value','desc')              
    .map(score => score.faqtId)              
    .value()                              

  const ftIndex = fullTextIndex(state)
  const ftFAQTIDS = ftIndex ? _.difference(ftIndex.search(text).map(item => item.ref), bestFAQTIDS) : []

  const FAQTS = faqts(state)
  const allFAQTIDS = _.map(FAQTS, 'id')
  const nonBestFAQTIDS = _.difference(allFAQTIDS, bestFAQTIDS)
  const unranked = _.difference(nonBestFAQTIDS, ftFAQTIDS)

  return getEm(FAQTS, [...bestFAQTIDS,...ftFAQTIDS, ...unranked])
}
function faqtsForSearchText(state, search) {
  const {text} = search
  const FAQTS = faqts(state)
  const allFAQTIDS = _.map(FAQTS, 'id')
  const ftIndex = fullTextIndex(state)

  const ftFAQTIDS = ftIndex ? ftIndex.search(text).map(item => item.ref) : []
  const unranked = _.difference(allFAQTIDS, ftFAQTIDS)

  return getEm(FAQTS, [...ftFAQTIDS, ...unranked])
}
function faqtsForNoSearch(state) {
  const FAQTS = [...faqts(state)]
  FAQTS.sort((a,b) => b.created - a.created)
  return FAQTS
}

export function findScore(state, searchId, faqtId) {
  return searchId ? scores(state).find(score => score.searchId === searchId && score.faqtId === faqtId) : null
}
export function findBestScore(state, searchId) {
  const matches = scores(state).filter(score => score.searchId === searchId)
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
export function getFaqts(state, search) {
  if(search) {
    if(search.id) return faqtsForSearchIdAndText(state, search)
    if(search.text && search.text.length) return faqtsForSearchText(state, search)
  }
  return faqtsForNoSearch(state)
}
export function findSearchByText(state, text) {
  if(_.isEmpty(text)) return null
  text = text.toLowerCase()
  return searches(state).find(Q => Q.text.toLowerCase() === text)
}
