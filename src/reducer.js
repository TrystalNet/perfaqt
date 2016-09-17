import FAQTS   from './faqts/faqts-reducer'
import SEARCHES from './searches/searches-reducer'
import SCORES    from './scores/scores-reducer'

const defaultUI = {
  uid: null,
  faqref: null, 
  faqtId: null, 
  focused: null,
  search: {faqref:null, id:null, text:null},
  broadcast: null,
  searchSuggestions: [],
  fldTags: '',
  fldEmail:'',
  fldPassword:''
}

function UI(uiState=defaultUI, {type, payload}) {
  switch(type) {
    case 'UPDATE_UI': return Object.assign({}, uiState, payload)
    default: return uiState    
  }
}
function FAQS(faqs=[], {type, payload}) {
  switch(type) {
    case 'ADD_FAQ': return [...faqs, payload]
  }
  return faqs  
}

function reducer(state={}, action) {
  console.log(action)
  const newState = {
    faqts     : FAQTS(state.faqts, action),
    searches  : SEARCHES(state.searches, action),
    scores    : SCORES(state.scores, action),
    faqs      : FAQS(state.faqs, action)
  }
  newState.ui = UI(state.ui, action)
  return newState
}

export const addFaq = faqref => ({type:'ADD_FAQ', payload:faqref})
export const updateUI = edits => ({ type: 'UPDATE_UI', payload:edits })
export default reducer
