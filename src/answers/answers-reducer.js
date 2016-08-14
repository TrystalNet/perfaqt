function reducer(answers=[], action) {
  switch(action.type) {  
    case 'LOAD_ANSWERS': return action.payload.answers
  }
  return answers
}

export default reducer
