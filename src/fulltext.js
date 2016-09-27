import lunr  from 'lunr'
import {faqtToKey} from './select'

export const FULLTEXT = lunr(function () {
  this.field('text')
  this.field('tags',{boost:100})
  this.ref('id') 
})

const faqtToFTFaqt = faqt => {
  const {text, tags} = faqt
  return {
    id:faqtToKey(faqt),
    text,
    tags
  }
}

export const updateFaqt = faqt => FULLTEXT.update(faqtToFTFaqt(faqt))
export const addFaqt    = faqt => FULLTEXT.add(faqtToFTFaqt(faqt))
export const removeFaqt = faqt => FULLTEXT.remove({id:faqtToKey(faqt)})

