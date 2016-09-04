const defaultState = {
  focused: null,
  faqtId: null, 
  // ------------- //
  search:'',
  index: null,
  connected: null,
  broadcast: null
}

// but here's the thing; we want the acxtive faqt to remain in place regardless 
// of where the focus is; so they need to be separate
// so first then, 
// 1. rename faqtId to focused <== this will actually be the control that is focused 
// 2. add faqtId, and have it take over the role of focused that focused has

function reducer(uiState=defaultState, action) {
  if(action.type === 'UI') 
    switch(action.uiType) {  
      case 'SET_SEARCH'    : return Object.assign({}, uiState, { search: action.payload.search })
      case 'SET_INDEX'     : return Object.assign({}, uiState, { index: action.payload.index })
      case 'SET_CONNECTED' : return Object.assign({}, uiState, { connected: action.payload.connected })
      case 'SET_BROADCAST' : return Object.assign({}, uiState, { broadcast: action.payload.broadcast })
      // ------------------- // 
      case 'SET_FOCUSED'    : return Object.assign({}, uiState, { focused: action.payload.focused })  
      case 'SET_FAQTID'     : return Object.assign({}, uiState, { faqtId: action.payload.faqtId })
    }
  return uiState
}

export default reducer
