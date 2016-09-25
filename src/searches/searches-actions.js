const simple = (type, payload) => ({type, payload})

export const addSearch    = search   => simple('ADD_SEARCH', search)
