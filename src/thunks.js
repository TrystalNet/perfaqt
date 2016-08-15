import * as DAL from './dal'
import * as SELECT from './select'
import * as ANSWERS from './answers/answers-actions'
import * as UI from './ui/ui-actions'

import {loadQuestions, addQuestion} from './questions/questions-actions'
import {loadScores, addScore, updateScore} from './scores/scores-actions'

function nextId(collection) {
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const validate = collection => id => collection.every(item => item.id !== id)
  const getId = () => getRandomIntInclusive(10,1000) 
  let id = getId()
  while(!validate(id)) {
    id = getId()
  }
  return id
}
export function initDatabase() {
  return function(dispatch) {
    DAL.openIt(() => {
      DAL.getAllAnswers(answers => dispatch(ANSWERS.loadAnswers(answers)))
      DAL.getAllQuestions(questions => dispatch(loadQuestions(questions)))
      DAL.getAllScores(scores => dispatch(loadScores(scores)))
    })
  }
}

export function saveQuestion(question) {
  return function(dispatch, getState, extras) {
    const questions = SELECT.questions(getState())
    const id = nextId(questions)
    const qn = {id, text:question}
    DAL.addQuestion(qn)
    .then(
      id => dispatch(addQuestion(qn)),
      e => console.log('i was unable to save that question', e))
  }
}

export function askQuestion(question) {
  return function(dispatch, getState, extras) {
    dispatch(UI.updateActiveQuestion(question) )
  }
}

export function updateAnswer(answerId, text) {
  return function(dispatch, getState, extras) {
    const state = getState()
    const A = SELECT.getAnswerById(state, answerId)
    if(!A) return
    const updated = Object.assign({}, A, {text})
    DAL.putAnswer(updated)
    .then(dispatch(ANSWERS.updateAnswer(answerId, {text}))) 
  }
}

export function addAnswer(text) {
  return function(dispatch, getState, extras) {
    const state = getState()
    const existingAnswer = SELECT.findAnswerByText(state, text)
    if(existingAnswer) return
    const id = nextId(SELECT.answers(state)) 
    const answer = { id, text }
    DAL.addAnswer(answer).then(
      () => dispatch(ANSWERS.addAnswer(answer)), 
      e => console.log('error in addUser', e)
    )
  }
}


export function setBestAnswer(question, aid) {
  return function(dispatch, getState, extras) {
    const state = getState()
    const Q = SELECT.findQuestionByText(state, question)
    if(!Q) return // change this to create the question
    let qid = Q.id

    let bestScore = SELECT.findBestScore(state, qid)
    let matchingScore = SELECT.findScore(state, qid, aid)
    let value = bestScore ? bestScore.value + 1 : 1

    if(matchingScore) {
      if(matchingScore === bestScore) return
      const score = Object.assign({}, matchingScore, {value})
      DAL.putScore(score)
      .then(dispatch(updateScore(matchingScore.id, {value})))
    }
    else {
      const id = nextId(SELECT.scores(state))
      const score = { id, qid, aid, value }
      DAL.addScore(score)
      .then(dispatch(addScore(score)))
    }
  }  
}
