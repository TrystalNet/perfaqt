import _ from 'lodash'
import FAQTS   from './reducer-faqts'
import {UI} from './reducer-ui'
import FAQS from './reducer-faqs'
import CFAQS from './reducer-cfaqs'

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
    ui    : UI(state.ui, action),
    faqs  : FAQS(state.faqs, action),
    cfaqs : CFAQS(state.cfaqs, action),
    faqts : FAQTS(state.faqts, action)
  }
  // if(interesting(state, newState))  console.log('interesting')
  return newState
}

export const updateTmpvalue = value => ({ type:'UPDATE_ACTIVEFIELD', payload:value })
export default reducer
