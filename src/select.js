import * as _ from 'lodash'
console.log(_)
export const answers = state => state.answers
export const questions = state => state.questions 
export const scores = state => state.scores

export const findQuestionByText = (state, text) => questions(state).find(Q => Q.text === text)
export const findAnswerByText   = (state, text) => answers(state).find(A => A.text === text)
export const getAnswerById = (state, id) => answers(state).find(A => A.id === id) 

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
  // use lodash or es6 arr functions, not both
  const ANSWERS = answers(state)
  const AIDS = _.map(ANSWERS, 'id')
  const SCORES = scores(state)
  const AINDEX = _.keyBy(ANSWERS, 'id')

  const qid = _.isEmpty(question) ? null : (findQuestionByText(state, question) || {id:null}).id
  if(qid) {
    const AIDS1 = _.chain(SCORES)
      .filter(score => score.qid === qid)   // only scores tied to the question
      .orderBy('value','desc')              // order by value desc
      .map(score => score.aid)              // take just the answer id
      .value()                              // return the aids

    const AIDS2 = _.difference(AIDS,AIDS1)

    return [...AIDS1,...AIDS2].map(aid => AINDEX[aid])
  }
  else {
    // step1,  start with answers that are not associated with any score
    // step1a, put blank answers at the top
    // step2,  eventually, order remaining answers by date desc
    const AIDS2 = _.chain(SCORES).map('aid').uniq().value()  // scored answers
    const AIDS1 = _.chain(AIDS)
      .difference(AIDS2)                               // unscored answers
      .sortBy(aid => AINDEX[aid].text.length)   // part0, no answers, part1, answers
      .value()
    return [...AIDS1,...AIDS2].map(aid => AINDEX[aid])
  }
}
