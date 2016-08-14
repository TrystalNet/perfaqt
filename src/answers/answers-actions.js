export function loadAnswers(answers) {
  return {
    type: 'LOAD_ANSWERS',
    payload: {
      answers
    } 
  }
}