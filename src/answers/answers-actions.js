export function addAnswer(answer) {
  return {
    type: 'ADD_ANSWER',
    payload: { answer }
  }
}
export function loadAnswers(answers) {
  return {
    type: 'LOAD_ANSWERS',
    payload: { answers } 
  }
}