const defaultState = {
  search:'',
  faqtId: null,
  index: null,
  connected: null,
  broadcast: null
}

function reducer(uiState=defaultState, action) {
  if(action.type === 'UI') 
    switch(action.uiType) {  
      case 'SET_SEARCH'    : return Object.assign({}, uiState, { search: action.payload.search })
      case 'SET_FAQTID'    : return Object.assign({}, uiState, { faqtId: action.payload.faqtId })
      case 'SET_INDEX'     : return Object.assign({}, uiState, { index: action.payload.index })
      case 'SET_CONNECTED' : return Object.assign({}, uiState, { connected: action.payload.connected })
      case 'SET_BROADCAST' : return Object.assign({}, uiState, { broadcast: action.payload.broadcast })
    }
  return uiState
}

export default reducer
