import _ from 'lodash'

function reducer(searches=[], action) {
  switch(action.type) {  
    case 'LOAD_SEARCHES': return action.payload.searches
    case 'ADD_SEARCH': return [...searches, action.payload.search]
    case 'DELETE_FAQ'  : return searches.filter(search => !_.isEqual(search.faqref, action.payload))
  }
  return searches
}

export default reducer
