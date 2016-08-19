export function updateAnswer(aid, edits) {
  return {
    type: 'UPDATE_ANSWER',
    payload: { aid, edits }
  }
}
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
export function mergeAnswers(answers) {
  return {
    type: 'MERGE_ANSWERS',
    payload: { answers } 
  }
}