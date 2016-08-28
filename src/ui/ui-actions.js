const simple = (uiType, payload) => ({ type: 'UI', uiType, payload})

export const setFaqtId    = faqtId    => simple('SET_FAQTID', { faqtId })
export const setSearch    = search    => simple('SET_SEARCH', { search })
export const setIndex     = index     => simple('SET_INDEX', { index }) 
export const setConnected = connected => simple('SET_CONNECTED', { connected }) 
export const setBroadcast = broadcast => simple('SET_BROADCAST', { broadcast }) 

