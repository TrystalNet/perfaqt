import lunr  from 'lunr'

export const FULLTEXT = lunr(function () {
  this.field('text')
  this.field('tags',{boost:100})
  this.ref('id') 
})

const toId = ({faqref:{uid,faqid}, id}) => `${uid}/${faqid}/${id}`

const faqtToFTFaqt = faqt => {
  const {text, tags} = faqt
  return {
    id:toId(faqt),
    text,
    tags,
    faqt   // makes it easy to work with later
  }
}

export const updateFaqt = faqt => FULLTEXT.update(faqtToFTFaqt(faqt))
export const addFaqt    = faqt => FULLTEXT.add(faqtToFTFaqt(faqt))
export const removeFaqt = faqt => FULLTEXT.remove(toId(faqt))

