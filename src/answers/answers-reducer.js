function updateAnswer(answers, {aid, edits}) {
  return answers.map(answer => {
    if(answer.id !== aid) return answer
    return Object.assign({}, answer, edits)
  })
}

function reducer(answers=[], action) {
  switch(action.type) {  
    case 'LOAD_ANSWERS': return action.payload.answers
    case 'ADD_ANSWER': return [...answers,action.payload.answer]
    case 'UPDATE_ANSWER': return updateAnswer(answers, action.payload)
  }
  return answers
}

export default reducer
