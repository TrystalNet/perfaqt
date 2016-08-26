function reducer(searches=[], action) {
  switch(action.type) {  
    case 'LOAD_SEARCHES': return action.payload.searches
    case 'ADD_SEARCH': return [...searches, action.payload.search]
  }
  return searches
}

export default reducer
