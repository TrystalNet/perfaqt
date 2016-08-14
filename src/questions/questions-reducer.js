function reducer(questions=[], action) {
  switch(action.type) {  
    case 'LOAD_QUESTIONS': return action.payload.questions
  }
  return questions
}

export default reducer
