export function updateActiveQuestion(question) {
  return {
    type: 'UPDATE_ACTIVE_QUESTION',
    payload: { question } 
  }
}