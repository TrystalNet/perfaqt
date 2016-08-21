export function loadQuestions(questions) {
  return {
    type: 'LOAD_QUESTIONS',
    payload: { questions } 
  }
}
export function addQuestion(question) {
  return {
    type: 'ADD_QUESTION',
    payload: { question }
  }
}