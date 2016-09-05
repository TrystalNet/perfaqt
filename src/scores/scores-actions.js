const simple = (type, payload) => ({type, payload})

export const loadScores = scores => simple('LOAD_SCORES', { scores }) 
export const updateScore = (id, edits) => simple('UPDATE_SCORE', { id, edits })
export const addScore    = score  => simple('ADD_SCORE', { score })
export const deleteScore = id     => simple('DELETE_SCORE', { id })
