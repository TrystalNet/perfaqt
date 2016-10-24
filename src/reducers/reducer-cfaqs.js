// const defaultCFaqs = [
//   {
//     uid: 'perfaqt',
//     faqId: 'help',
//     isRO: true
//   }
// ] 

function deleteCFaq(cfaqs, {uid, faqId}) {
  const delcfaq = cfaqs.find(cfaq => cfaq.uid === uid && cfaq.faqId === faqId)
  if(!delcfaq) return cfaqs
  return cfaqs.filter(cfaq => cfaq !== delcfaq)
}

export default function CFAQS(cfaqs=[], {type, payload}) {
  switch(type) {
    case 'ADD_CFAQ': return [...cfaqs, payload]
    case 'DELETE_CFAQ': return deleteCFaq(cfaqs, payload)
  }
  return cfaqs  
}

export const removeCFaq = faqref => ({type:'DELETE_CFAQ', payload:faqref})
export const addCFaq = faqref => ({type:'ADD_CFAQ', payload:faqref})
