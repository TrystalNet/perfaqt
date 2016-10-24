function deleteFaq(faqs, {uid, faqId}) {
  const delfaq = faqs.find(faq => faq.uid === uid && faq.faqId === faqId)
  if(!delfaq) return faqs
  return faqs.filter(faq => faq !== delfaq)
}

function FAQS(faqs=[], {type, payload}) {
  switch(type) {
    case 'ADD_FAQ': return [...faqs, payload]
    case 'DELETE_FAQ': return deleteFaq(faqs, payload)
  }
  return faqs  
}

export const removeFaq = faqref => ({type:'DELETE_FAQ', payload:faqref})
export const addFaq = faqref => ({type:'ADD_FAQ', payload:faqref})
export const updateTmpvalue = value => ({ type:'UPDATE_ACTIVEFIELD', payload:value })

export default FAQS
