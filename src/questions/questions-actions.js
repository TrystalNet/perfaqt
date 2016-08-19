export function loadQuestions(questions) {
  return {
    type: 'LOAD_QUESTIONS',
    payload: { questions } 
  }
}

export function mergeQuestions(questions) {
  return {
    type: 'MERGE_QUESTIONS',
    payload: { questions } 
  }
}


export function addQuestion(question) {
  return {
    type: 'ADD_QUESTION',
    payload: { question }
  }
}