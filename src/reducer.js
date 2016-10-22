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
function CLOSEDFAQS(closedFaqs=[], {type, payload}) {
  switch(type) {
    case '': return []
  }
  return closedFaqs
}

function showStatus(state) {
  console.log(`${state.faqts.length} faqts, ${state.scores.length} scores, ${state.searches.length} searches`)
}

function interesting(oldState, newState) {
  if(!oldState || !oldState.ui || !oldState.ui.activeField) return false
  if(oldState.ui.activeField.fldName !== 'fldFaqt') return false
  if(newState.ui.activeField.fldName === 'fldFaqt') return false
  return true
}


function reducer(state={}, action) {
  const newState = {
    ui         : UI(state.ui, action),
    faqs       : FAQS(state.faqs, action),
    closedFaqs : CLOSEDFAQS(state.faqsClosed, action),
    faqts      : FAQTS(state.faqts, action)
  }
  // if(interesting(state, newState))  console.log('interesting')
  return newState
}

export const removeFaq = faqref => ({type:'DELETE_FAQ', payload:faqref})
export const addFaq = faqref => ({type:'ADD_FAQ', payload:faqref})
export const updateTmpvalue = value => ({ type:'UPDATE_ACTIVEFIELD', payload:value })
export default reducer
