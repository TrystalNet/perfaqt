function reducer(answers=[], action) {
  switch(action.type) {  
    case 'LOAD_ANSWERS': return action.payload.answers
    case 'ADD_ANSWER': return [...answers,action.payload.answer]
  }
  return answers
}

export default reducer
