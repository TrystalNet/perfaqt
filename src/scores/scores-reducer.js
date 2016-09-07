function updateScore(scores, {faqId, id, edits}) {
  const oldVersion = scores.find(score => score.faqId === faqId && score.id === id)
  const newVersion = Object.assign({}, oldVersion, edits)
  return scores.map(score => (score.faqId === faqId && score.id === id) ? newVersion : score)
}

function deleteScore(scores, {faqId, id}) {
  return scores.filter(score => score.faqId !== faqId || score.id !== id)
}

function reducer(scores=[], action) {
  switch(action.type) {  
    case 'LOAD_SCORES':  return [...action.payload.scores]
    case 'ADD_SCORE':    return [...scores, action.payload.score]
    case 'UPDATE_SCORE': return updateScore(scores, action.payload)
    case 'DELETE_SCORE': return deleteScore(scores, action.payload)
  }
  return scores
}

export default reducer
