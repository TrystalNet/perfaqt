import {last} from 'lodash'

const defaultUI = {
  broadcast: null,
  uid: null,
  faqtKey: null,
  hoverFaqtKey: null,
  focused: null,
  search: {text:'', scores:[]},
  searchSuggestions: [],
  fldEmail:'',
  fldPassword:'',
  activeFieldStack:[],
  page:'',
  editFaq: {
    faqId: ''
  },
  activeField: {
    objectId: null,
    fldName:null,
    tmpValue:null
  }
}

const [UPDATE_UI, UPDATE_ACTIVEFIELD, PUSH_ACTIVEFIELD, POP_ACTIVEFIELD] = 
  'UPDATE_UI,UPDATE_ACTIVEFIELD,PUSH_ACTIVEFIELD,POP_ACTIVEFIELD'.split(',')

function _pushActiveField(uiState) {
  const {activeField} = uiState
  const activeFieldStack = [...uiState.activeFieldStack, activeField]
  return Object.assign({}, uiState, {activeFieldStack, activeField:{}})
}

function _popActiveField(uiState) {
  const {activeFieldStack:stack} = uiState
  const activeField = last(stack)
  const activeFieldStack = [...stack].pop()
  return Object.assign({}, uiState, {activeField, activeFieldStack})
}

function _updateActiveField(uiState, payload) {
  const activeField = Object.assign({}, uiState.activeField, payload)
  return Object.assign({}, uiState, {activeField})
}

export function UI(uiState=defaultUI, {type, payload}) {
  switch(type) {
    case UPDATE_UI:          return Object.assign({}, uiState, payload)
    case UPDATE_ACTIVEFIELD: return _updateActiveField(uiState, payload)
    case PUSH_ACTIVEFIELD:   return _pushActiveField(uiState)
    case POP_ACTIVEFIELD:    return _popActiveField(uiState)
    default: return uiState    
  }
}
export const updateUI = edits => ({ type: UPDATE_UI, payload:edits })
export const popActiveField = () => ({type: POP_ACTIVEFIELD})
export const pushActiveField = () => ({type: PUSH_ACTIVEFIELD})
