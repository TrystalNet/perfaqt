function reducer(uiState={}, action) {
  switch(action.type) {  
    case 'UPDATE_ACTIVE_QUESTION': return Object.assign({}, uiState, { question: action.payload.question })
  }
  return uiState
}

export default reducer
