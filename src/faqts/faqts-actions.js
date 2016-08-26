const simple = (type, payload) => ({type, payload})

export const updateFaqt = (faqtId, edits) => simple('UPDATE_FAQT', { faqtId, edits })
export const addFaqt    = faqt => simple('ADD_FAQT', { faqt })
export const loadFaqts  = faqts => simple('LOAD_FAQTS', { faqts }) 
