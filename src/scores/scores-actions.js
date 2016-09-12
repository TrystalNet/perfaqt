const simple = (type, payload) => ({type, payload})

export const loadScores = scores => simple('LOAD_SCORES', { scores }) 
export const addScore    = score  => simple('ADD_SCORE', { score })
export const updateScore = (faqref, id, edits) => simple('UPDATE_SCORE', { faqref, id, edits })
export const deleteScore = score        => simple('DELETE_SCORE', score)
