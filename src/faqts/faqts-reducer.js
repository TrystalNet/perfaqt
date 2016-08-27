function updateFaqt(faqts, {faqtId, edits}) {
  return faqts.map(faqt => {
    if(faqt.id !== faqtId) return faqt
    return Object.assign({}, faqt, edits)
  })
}

function reducer(faqts=[], action) {
  switch(action.type) {  
    case 'LOAD_FAQTS': return action.payload.faqts
    case 'ADD_FAQT': return [...faqts,action.payload.faqt]
    case 'UPDATE_FAQT': return updateFaqt(faqts, action.payload)
  }
  return faqts
}

export default reducer
