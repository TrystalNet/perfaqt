import FAQTS   from './faqts/faqts-reducer'
import SEARCHES from './searches/searches-reducer'
import SCORES    from './scores/scores-reducer'

const defaultUI = {
  uid: null,
  faqref: null, 
  faqt: null, 
  focused: null,
  search: null,
  index: null,
  broadcast: null,
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

function reducer(state={}, action) {
  const newState = {
    faqts     : FAQTS(state.faqts, action),
    searches  : SEARCHES(state.searches, action),
    scores    : SCORES(state.scores, action),
  }
  const ui = UI(state.ui, action)
  newState.ui = ui
  return newState
}

export const updateUI = edits => ({ type: 'UPDATE_UI', payload:edits })
export default reducer
