import * as _ from 'lodash'
export const faqts = state => state.faqts
export const searches = state => state.searches 
export const scores = state => state.scores
export const fullTextIndex = state => state.ui.index

export const findSearchByText = (state, text) => {
  text = text.toLowerCase()
  return searches(state).find(Q => Q.text.toLowerCase() === text)
}
export const findFaqtByText   = (state, text) => faqts(state).find(A => A.text === text)
export const getFaqtById      = (state, id) => faqts(state).find(A => A.id === id) 

export function findScore(state, searchId, faqtId) {
  return scores(state).find(score => score.searchId === searchId && score.faqtId === faqtId)
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

function faqtsForSearchId(state, searchId, search) {
  const SCORES = scores(state)
  const FAQTS = faqts(state)
  const allFAQTIDS = _.map(FAQTS, 'id')
  const bestFAQTIDS = _.chain(SCORES)
    .filter(score => score.searchId === searchId)   // only scores tied to the search
    .orderBy('value','desc')              // order by value desc
    .map(score => score.faqtId)              // take just the faqt id
    .value()                              // return the faqtIds

  const ftFAQTIDS = _.difference(fullTextIndex(state).search(search).map(item => item.ref), bestFAQTIDS)

  const nonBestFAQTIDS = _.difference(allFAQTIDS, bestFAQTIDS)
  const unranked = _.difference(nonBestFAQTIDS, ftFAQTIDS)

  const FAQT_INDEX = _.keyBy(FAQTS, 'id')
  return [...bestFAQTIDS,...ftFAQTIDS, ...unranked].map(faqtId => FAQT_INDEX[faqtId])
}

function faqtsForNoSearch(state) {
  // step1,  start with faqts that are not associated with any score
  // step1a, put blank faqts at the top
  // step2,  eventually, order remaining faqts by date desc
  const SCORES = scores(state)
  const FAQTS = faqts(state)
  const FAQTIDS = _.map(FAQTS, 'id')
  const FAQTIDS2 = _.chain(SCORES).map('faqtId').uniq().value()  // scored faqts
  const FAQTINDEX = _.keyBy(FAQTS, 'id')
  const FAQTIDS1 = _.chain(FAQTIDS)
    .difference(FAQTIDS2)                               // unscored faqts
    .sortBy(faqtId => FAQTINDEX[faqtId].text.length)   // part0, no faqts, part1, faqts
    .value()
  return [...FAQTIDS1,...FAQTIDS2].map(faqtId => FAQTINDEX[faqtId])
}

export function rankedFaqts(state, search) {
  const searchId = _.isEmpty(search) ? null : (findSearchByText(state, search) || {id:null}).id
  if(searchId) return faqtsForSearchId(state, searchId, search)
  return faqtsForNoSearch(state)
}
