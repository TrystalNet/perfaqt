import _ from 'lodash'
import FAQTS   from './faqts/faqts-reducer'
import SEARCHES from './searches/searches-reducer'
import SCORES    from './scores/scores-reducer'
import NEWSCORES    from './scores/newscores-reducer'

const defaultUI = {
  uid: null,
  faqref: null, 
  faqtId: null, 
  focused: null,
  search: {faqref:null, id:null, text:null},
  broadcast: null,
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
    searches  : SEARCHES(state.searches, action),
    scores    : SCORES(state.scores, action),
    newscores : NEWSCORES(state.newscores, action),
    faqs      : FAQS(state.faqs, action)
  }
  newState.ui = UI(state.ui, action)
  // showStatus(newState)
  return newState
}

export const removeFaq = faqref => ({type:'DELETE_FAQ', payload:faqref})
export const addFaq = faqref => ({type:'ADD_FAQ', payload:faqref})
export const updateUI = edits => ({ type: 'UPDATE_UI', payload:edits })
export const updateTmpvalue = value => ({ type:'UPDATE_ACTIVEFIELD', payload:value })
export default reducer
