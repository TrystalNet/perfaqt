function reducer(questions=[], action) {
  switch(action.type) {  
    case 'LOAD_QUESTIONS': return action.payload.questions
    case 'ADD_QUESTION': return [...questions, action.payload.question]
  }
  return questions
}

export default reducer
