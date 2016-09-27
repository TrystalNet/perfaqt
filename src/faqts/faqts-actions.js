const simple = (type, payload) => ({type, payload})

export const replaceFaqt = faqt => simple('REPLACE_FAQT', faqt)
export const addFaqt     = faqt => simple('ADD_FAQT',     faqt) // faqt includes faqref for now
export const removeFaqt  = faqt => simple('REMOVE_FAQT', faqt) 
