import _ from 'lodash'

const same = (A,B) => A.id === B.id && _.isEqual(A.faqref, B.faqref)

function updateScore(scores, {faqId, id, edits}) {
  const oldVersion = scores.find(score => score.faqId === faqId && score.id === id)
  const newVersion = Object.assign({}, oldVersion, edits)
  return scores.map(score => (score.faqId === faqId && score.id === id) ? newVersion : score)
}


function reducer(scores=[], action) {
  switch(action.type) {  
    case 'LOAD_SCORES':  return [...action.payload.scores]
    case 'ADD_SCORE':    return [...scores, action.payload.score]
    case 'UPDATE_SCORE': return updateScore(scores, action.payload)
    case 'DELETE_SCORE': return scores.filter(score => !same(score, action.payload))
  }
  return scores
}

export default reducer
