export function setAID(aid) {
  return {
    type: 'UI',
    uiType: 'SET_AID',
    payload: {aid}
  }
}
export function setQestion(question) {
  return {
    type: 'UI',
    uiType: 'SET_QUESTION',
    payload: { question } 
  }
}