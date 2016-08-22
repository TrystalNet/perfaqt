const defaultState = {
  question:'',
  aid: null
}

function reducer(uiState=defaultState, action) {
  if(action.type === 'UI') 
    switch(action.uiType) {  
      case 'SET_QUESTION': return Object.assign({}, uiState, { question: action.payload.question })
      case 'SET_AID': return Object.assign({}, uiState, { aid: action.payload.aid })
    }
  return uiState
}

export default reducer
