import * as SELECT from '../select'
import {toFaqtRef} from '../select'
import _ from 'lodash'

const same = (A,B) => A.id === B.id && _.isEqual(A.faqref,B.faqref)

function addFaqt(faqts, action) {
  const {faqt} = action.payload
  const {faqref, id} = faqt
  const alreadyThere = faqts.find(faqt => _.isEqual(faqt.faqref, faqref) && faqt.id === id)
  if(alreadyThere) return faqts
  return [...faqts, Object.assign({}, faqt)]
}

function reducer(faqts=[], action) {
  switch(action.type) {  
    case 'LOAD_FAQTS': return action.payload.faqts
    case 'ADD_FAQT': return addFaqt(faqts, action)
    case 'REPLACE_FAQT': return faqts.map(faqt => same(faqt, action.payload) ? action.payload : faqt )
  }
  return faqts
}

export default reducer
