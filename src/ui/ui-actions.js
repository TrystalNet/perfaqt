export function setAID(aid) {
  return {
    type: 'UI',
    uiType: 'SET_AID',
    payload: {aid}
  }
}
export function setQuestion(question) {
  return {
    type: 'UI',
    uiType: 'SET_QUESTION',
    payload: { question } 
  }
}
export function setIsDirty(isDirty) {
  return {
    type: 'UI',
    uiType: 'SET_ISDIRTY',
    payload: { isDirty } 
  }
}
export function setIsDEVL(isDEVL) {
  return {
    type: 'UI',
    uiType: 'SET_ISDEVL',
    payload: { isDEVL } 
  }
}