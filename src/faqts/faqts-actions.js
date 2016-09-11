const simple = (type, payload) => ({type, payload})

export const updateFaqt = (faqref, faqtId, edits) => simple('UPDATE_FAQT', { faqref, faqtId, edits })
export const addFaqt    = faqt => simple('ADD_FAQT', { faqt }) // faqt includes faqref for now
export const loadFaqts  = faqts => simple('LOAD_FAQTS', { faqts }) 
