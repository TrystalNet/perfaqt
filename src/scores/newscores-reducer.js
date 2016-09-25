import _ from 'lodash'

const same = (A,B) => A.id === B.id && _.isEqual(A.faqref, B.faqref)

function updateScore(newscores, {faqref, id, edits}) {
  const oldVersion = newscores.find(newscore => _.isEqual(newscore.faqref, faqref) && newscore.id === id)
  const newVersion = Object.assign({}, oldVersion, edits)
  return newscores.map(score => (_.isEqual(score.faqref,faqref) && score.id === id) ? newVersion : score)
}

function reducer(newscores=[], action) {
  switch(action.type) {  
    // case 'LOAD_SCORES':  return [...action.payload.scores]
    // case 'DELETE_FAQ'  : return scores.filter(score => !_.isEqual(score.faqref, action.payload))
    case 'NEWADD_SCORE':    return [...newscores, action.payload]
    case 'NEWUPDATE_SCORE': return updateScore(newscores, action.payload)
    case 'NEWDELETE_SCORE': return newscores.filter(score => !same(score, action.payload))
  }
  return newscores
}

export default reducer
