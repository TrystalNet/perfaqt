const simple = (type, payload) => ({type, payload})

export const loadScores = scores => simple('LOAD_SCORES', { scores }) 
export const addScore    = score  => simple('ADD_SCORE', { score })
export const updateScore = (faqref, id, edits) => simple('UPDATE_SCORE', { faqref, id, edits })
export const deleteScore = score        => simple('DELETE_SCORE', score)

// export const loadScores = scores => simple('LOAD_SCORES', { scores })
export const NEWaddScore    = score  => simple('NEWADD_SCORE', score)
export const NEWupdateScore = (faqref, id, edits) => simple('NEWUPDATE_SCORE', { faqref, id, edits })
export const NEWdeleteScore = score        => simple('NEWDELETE_SCORE', score)
