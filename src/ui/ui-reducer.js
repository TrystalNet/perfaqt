const defaultState = {
  search:'',
  faqtId: null,
  isDirty: false,
  isDEVL: false,
  index: null,
  email: null
}

function reducer(uiState=defaultState, action) {
  if(action.type === 'UI') 
    switch(action.uiType) {  
      case 'SET_SEARCH'    : return Object.assign({}, uiState, { search: action.payload.search })
      case 'SET_FAQTID'    : return Object.assign({}, uiState, { faqtId: action.payload.faqtId })
      case 'SET_ISDIRTY'   : return Object.assign({}, uiState, { isDirty: action.payload.isDirty })
      case 'SET_ISDEVL'    : return Object.assign({}, uiState, { isDEVL: action.payload.isDEVL })
      case 'SET_INDEX'     : return Object.assign({}, uiState, { index: action.payload.index })
      case 'SET_EMAIL'     : return Object.assign({}, uiState, { email: action.payload.email })
    }
  return uiState
}

export default reducer
