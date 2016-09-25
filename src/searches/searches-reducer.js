import _ from 'lodash'

// FUCK: WORK OUT WHAT NEEDS TO HAPPEN IN SEARCHES WHEN A FAQ IS DELETED

function reducer(searches=[], action) {
  switch(action.type) {  
    case 'ADD_SEARCH': return [...searches, action.payload]
    case 'DELETE_FAQ'  : return searches.filter(search => !_.isEqual(search.faqref, action.payload))
  }
  return searches
}

export default reducer
