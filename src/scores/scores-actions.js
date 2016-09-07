const simple = (type, payload) => ({type, payload})

export const loadScores = scores => simple('LOAD_SCORES', { scores }) 
export const addScore    = score  => simple('ADD_SCORE', { score })
export const updateScore = (faqId, id, edits) => simple('UPDATE_SCORE', { faqId, id, edits })
export const deleteScore = (faqId, id)        => simple('DELETE_SCORE', { faqId, id })
