export function loadScores(scores) {
  return {
    type: 'LOAD_SCORES',
    payload: { scores } 
  }
}
export function addScore(score) {
  return {
    type: 'ADD_SCORE',
    payload: { score }
  }
}
export function updateScore(id, edits) {
  return {
    type: 'UPDATE_SCORE',
    payload: { id, edits }
  }
}