import _ from 'lodash'
import FAQTS   from './faqts/faqts-reducer'
import {UI} from './reducer-ui'

function FAQS(faqs=[], {type, payload}) {
  switch(type) {
    case 'ADD_FAQ': return [...faqs, payload]
    case 'DELETE_FAQ': return faqs.filter(faqref => !_.isEqual(faqref, payload))
  }
  return faqs  
}

function showStatus(state) {
  console.log(`${state.faqts.length} faqts, ${state.scores.length} scores, ${state.searches.length} searches`)
}
function reducer(state={}, action) {
  const newState = {
    faqts     : FAQTS(state.faqts, action),
    faqs      : FAQS(state.faqs, action),
    ui        : UI(state.ui, action)
  }
  return newState
}

export const removeFaq = faqref => ({type:'DELETE_FAQ', payload:faqref})
export const addFaq = faqref => ({type:'ADD_FAQ', payload:faqref})
export const updateTmpvalue = value => ({ type:'UPDATE_ACTIVEFIELD', payload:value })
export default reducer
