function updateScore(scores, {id, edits}) {
  const oldVersion = scores.find(item => item.id === id)
  const newVersion = Object.assign({}, oldVersion, edits)
  return scores.map(score => score.id !== id ? score : newVersion)
}

function deleteScore(scores, {id}) {
  const result = scores.filter(score => score.id !== id)
  return result
}

function reducer(scores=[], action) {
  switch(action.type) {  
    case 'UPDATE_SCORE': return updateScore(scores, action.payload)
    case 'LOAD_SCORES':  return action.payload.scores
    case 'ADD_SCORE':    return [...scores, action.payload.score]
    case 'DELETE_SCORE': return deleteScore(scores, action.payload)
  }
  return scores
}

export default reducer
