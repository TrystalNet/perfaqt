function updateFaqt(faqts, {faqtId, edits}) {
  const faqt = faqts.find(F => F.id === faqtId)
  if(!faqt || (faqt.text === edits.text)) return faqts  
  return faqts.map(faqt => {
    if(faqt.id !== faqtId) return faqt
    return Object.assign({}, faqt, edits)
  })
}

// switch to using an object here
function addFaqt(faqts, action) {
  const newFaqt = action.payload.faqt
  const alreadyThere = faqts.find(faqt => faqt.id === newFaqt.id)
  return alreadyThere ? faqts : [...faqts, newFaqt]
}

function reducer(faqts=[], action) {
  switch(action.type) {  
    case 'LOAD_FAQTS': return action.payload.faqts
    case 'ADD_FAQT': return addFaqt(faqts, action)
    case 'UPDATE_FAQT': return updateFaqt(faqts, action.payload)
  }
  return faqts
}

export default reducer
