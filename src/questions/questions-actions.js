export function loadQuestions(questions) {
  return {
    type: 'LOAD_QUESTIONS',
    payload: { questions } 
  }
}