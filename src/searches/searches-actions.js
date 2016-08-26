const simple = (type, payload) => ({type, payload})

export const loadSearches = searches => simple('LOAD_SEARCHES', { searches }) 
export const addSearch    = search   => simple('ADD_SEARCH', { search })
