import * as SELECT from '../select'
import {toFaqtRef} from '../select'
import _ from 'lodash'

function updateFaqt(faqts, {faqref, faqtId, edits}) {
  const faqt = SELECT.getFaqt(faqref, faqtId)
  if(!faqt) return faqts
  if(faqt.text === edits.text && faqt.tags === edits.tags) return faqts
  return faqts.map(faqt => {
    if(!_.isEqual(toFaqtRef(faqt)))
    if( faqt.id !== faqtId) return faqt
    return Object.assign({}, faqt, edits)
  })
}

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
    case 'UPDATE_FAQT': return updateFaqt(faqts, action.payload)
  }
  return faqts
}

export default reducer
