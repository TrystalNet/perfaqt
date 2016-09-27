import isEqual from 'lodash'

const setScore = (scores, score) => (new Map([...scores])).set(score.id, score)
const unsetScore = (scores, score) => {
  const newScores = new Map([...scores])
  newScores.delete(score.id)
  return newScores
}
const unsetFaq = (scores, faqref) => new Map([...scores].filter(score => !isEqual(score.faqref, faqref)))

// the only thing that can change in a score is the value,
// so we do special handling
function setScoreValue(scores, {id,value}) {
  const newMap = new Map([...scores])
  const score = Object.assign({}, scores.get(id), {value})
  newMap.set(id, score)
  return newMap
} 

function reducer(scores=new Map(), action) {
  switch(action.type) {  
    case 'ADD_SCORE':    return setScore(scores, action.payload)
    case 'SET_SCOREVALUE': return setScoreValue(scores, action.payload)
    case 'DELETE_SCORE': return unsetScore(scores, action.payload) 
    case 'DELETE_FAQ'  : return unsetFaq(scores, action.payload)
  }
  return scores
}

export default reducer
