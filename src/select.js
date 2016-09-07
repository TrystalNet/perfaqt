import * as _ from 'lodash'
import ftdbs from './fulltext' 
export const faqts = state => state.faqts
export const searches = state => state.searches 
export const scores = state => state.scores
export const fullTextIndex = state => state.ui.index
export const getSearch = state => state.ui.search

export const findFaqtByText   = (state, text) => faqts(state).find(A => A.text === text)
export const getFaqtById      = (state, faqId, id) => faqts(state).find(A => A.faqId === faqId && A.id === id)
 
function faqtsForSearchIdAndText(state, faqId, search) {
  const {id, text} = search
  const SCORES = scores(state).filter(score => score.faqId === faqId)
  const bestFAQTIDS = _.chain(SCORES)
    .filter(score => score.searchId === id)   
    .orderBy('value','desc')              
    .map(score => score.faqtId)              
    .value()                              

  const ftIndex = ftdbs[faqId]
  const ftFAQTIDS = ftIndex ? _.difference(ftIndex.search(text).map(item => item.ref), bestFAQTIDS) : []

  const FAQTS = faqts(state).filter(faqt=> faqt.faqId === faqId)
  const allFAQTIDS = _.map(FAQTS, 'id')
  const nonBestFAQTIDS = _.difference(allFAQTIDS, bestFAQTIDS)
  const unranked = _.difference(nonBestFAQTIDS, ftFAQTIDS)

  return [...bestFAQTIDS,...ftFAQTIDS, ...unranked]
}
function faqtsForSearchText(state, faqId, search) {
  const {text} = search
  const FAQTS = faqts(state).filter(faqt => faqt.faqId === faqId)
  const allFAQTIDS = _.map(FAQTS, 'id')
  const ftIndex = ftdbs[faqId]
  const ftFAQTIDS = ftIndex ? ftIndex.search(text).map(item => item.ref) : []
  const unranked = _.difference(allFAQTIDS, ftFAQTIDS)
  return [...ftFAQTIDS, ...unranked]
}
function faqtsForNoSearch(state, faqId) {
  const FAQTS = [...faqts(state).filter(faqt => faqt.faqId === faqId)]
  FAQTS.sort((a,b) => b.created - a.created)
  return FAQTS.map(faqt => faqt.id)
}
export function findScore(state, faqId, searchId, faqtId) {
  if(!searchId) return null
  return scores(state).find(score => score.faqId === faqId && score.searchId === searchId && score.faqtId === faqtId)
}
export function findBestScore(state, faqId, searchId) {
  const matches = scores(state).filter(score => score.faqId === faqId && score.searchId === searchId)
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
export function getFaqtIds(state, faqId, search) {
  if(search) {
    if(search.id) return faqtsForSearchIdAndText(state, faqId, search)
    if(search.text && search.text.length) return faqtsForSearchText(state, faqId, search)
  }
  return faqtsForNoSearch(state, faqId)
}
export function findSearchByText(state, faqId, text) {
  if(!text) return null
  text = text.toLowerCase()
  return searches(state).find(search => search.faqId === faqId && search.text.toLowerCase() === text)
}
