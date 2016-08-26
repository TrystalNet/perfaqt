const simple = (uiType, payload) => ({ type: 'UI', uiType, payload})

export const setFaqtId   = faqtId   => simple('SET_FAQTID', {faqtId})
export const setSearch   = search   => simple('SET_SEARCH', { search })
export const setIsDirty  = isDirty  => simple('SET_ISDIRTY', { isDirty }) 
export const setIsDEVL   = isDEVL   => simple('SET_ISDEVL', { isDEVL }) 
export const setIndex    = index    => simple('SET_INDEX', { index }) 
