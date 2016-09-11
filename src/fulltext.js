const databases = {}

export const dbkey = ({uid,faqId}) => `${uid}-${faqId}`
export const dbForFaqref = faqref => databases[dbkey(faqref)] 

export default databases
