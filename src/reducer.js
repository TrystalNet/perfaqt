import _ from 'lodash'
import FAQTS   from './faqts/faqts-reducer'

const defaultUI = {
  broadcast: null,
  uid: null,
  faqtKey: null, 
  focused: null,
  search: {text:'', scores:[]},
  searchSuggestions: [],
  fldEmail:'',
  fldPassword:'',
  activeField: {
    objectId: null,
    fldName:null,
    tmpValue:null
  }
}

function UI(uiState=defaultUI, {type, payload}) {
  switch(type) {
    case 'UPDATE_UI': 
      return Object.assign({}, uiState, payload)

    case 'UPDATE_ACTIVEFIELD':
      const activeField = Object.assign({}, uiState.activeField, payload)
      return Object.assign({}, uiState, {activeField})

    default: 
      return uiState    
  }
}
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
export const updateUI = edits => ({ type: 'UPDATE_UI', payload:edits })
export const updateTmpvalue = value => ({ type:'UPDATE_ACTIVEFIELD', payload:value })
export default reducer
