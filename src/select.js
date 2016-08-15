import * as _ from 'lodash'
export const answers = state => state.answers
export const questions = state => state.questions 
export const scores = state => state.scores

export const findQuestionByText = (state, text) => questions(state).find(Q => Q.text === text)
export const findAnswerByText   = (state, text) => answers(state).find(A => A.text === text)

export function findScore(state, qid, aid) {
  return scores(state).find(score => score.qid === qid && score.aid === aid)
}

export function findBestScore(state, qid) {
  const matches = scores(state).filter(score => score.qid === qid)
  switch(matches.length) {
    case 0: return null
    case 1: return matches[0]
  }
  return matches.reduce((accum, item) => {
    const accumValue = accum.value || 0
    const itemValue = item.value || 0
    return itemValue > accumValue ? item : accum
  })
} 

export function rankedAnswers(state, question) {
  if(!question || !question.length) return []
  const qrec = findQuestionByText(state, question)
  if(!qrec) return answers(state)

  const A1 = _.filter(scores(state), score => score.qid === qrec.id)
  const A2 = _.orderBy(A1, 'value', 'desc')
  const A3 = _.map(A2, 'aid')

  const B1 = _.map(answers(state), 'id')
  const B2 = _.difference(B1,A3)

  const index = _.keyBy(answers(state), 'id')

  const C1 = [...A3,...B2].map(aid => index[aid])

  return C1
}
