import {faqtToKey} from '../select'

function addFaqt(faqts, {payload:faqt}) {
  const key = faqtToKey(faqt)
  return faqts.has(key) ? faqts : (new Map([...faqts])).set(key, faqt)
}


function reducer(faqts=new Map(), action) {
  switch(action.type) {  
    case 'ADD_FAQT': return addFaqt(faqts, action)
    case 'REPLACE_FAQT': return new Map([...faqts]).set(faqtToKey(action.payload), action.payload)
    case 'DELETE_FAQ'  : return new Map([...faqts]).delete(faqtToKey(action.payload))
  }
  return faqts
}

export default reducer

// for tonight: continue switching back from faqt to faqtId in the UI state
// we are doing this because this is the only simple way the UI can know that a newly added FAQT should be active

