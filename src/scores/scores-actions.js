const simple = (type, payload) => ({type, payload})

export const addScore      = score  => simple('ADD_SCORE', score)
export const deleteScore   = score  => simple('DELETE_SCORE', score)
export const setScoreValue = (id, value) => simple('SET_SCOREVALUE', { id, value })
