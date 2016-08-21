import $ from 'jquery'
import * as UNIQ from '@trystal/uniq-ish'
import * as SELECT from './select'
import * as ANSWERS from './answers/answers-actions'
import * as QUESTIONS from './questions/questions-actions'
import * as SCORES from './scores/scores-actions'
import * as UI from './ui/ui-actions'

export function saveQuestion(question) {
  return function(dispatch) {
    const id = UNIQ.randomId(4)
    const text = question
    dispatch(QUESTIONS.addQuestion({id, text}))
  }
}
export function askQuestion(question) {
  return function(dispatch) {
    dispatch(UI.updateActiveQuestion(question) )
  }
}
export function updateAnswer(answerId, text) {
  return function(dispatch, getState) {
    const state = getState()
    const A = SELECT.getAnswerById(state, answerId)
    if(!A) return
    dispatch(ANSWERS.updateAnswer(answerId, {text}))
  }
}
export function addAnswer(text) {
  return function(dispatch, getState) {
    const state = getState()
    const existingAnswer = SELECT.findAnswerByText(state, text)
    if(existingAnswer) return
    const id = UNIQ.randomId(4) 
    dispatch(ANSWERS.addAnswer({ id, text }))
  }
}
export function save() { 
  return function(dispatch, getState) {
    const state = getState()
    const upload = {
      answers  : state.answers,
      questions: state.questions,
      scores   : state.scores
    }
    $.ajax({
      type: 'PUT',
      contentType: 'application/json',
      url: `/save`,
      data: JSON.stringify(upload)
    })
    .done(result => console.log('save was ok, result was ', result))
    .fail((a, textStatus, errorThrown) => alert('error occurred: ' + errorThrown))
}}
function buildFakeData(howMany=10) {
  const questions = []
  const answers = []
  const scores = []
  for(var i = 0; i < howMany; i++) {
    const qid = 'q' + i
    const aid = 'a' + i
    const sid = 's' + i
    questions.push({id:qid, text:'question ' + i})
    answers.push({id:aid, text:'Answer ' + i})
    scores.push({id:sid, qid, aid, value:1})
  }
  return {questions, answers, scores}
}


export function load() { 
  return function(dispatch, getState) {
    const state = getState()
    console.log('really loading')
    $.ajax({
      type: 'GET',
      contentType: 'application/json',
      url: `/load`
    })
    .done(data => {
      data = buildFakeData(50)
      dispatch(QUESTIONS.loadQuestions(data.questions))
      dispatch(ANSWERS.loadAnswers(data.answers))
      dispatch(SCORES.loadScores(data.scores))
    })
    .fail((a, textStatus, errorThrown) => {
      alert('error occurred: ' + errorThrown)
    })
}}
export function setBestAnswer(question, aid) {
  return function(dispatch, getState, extras) {
    const state = getState()
    const Q = SELECT.findQuestionByText(state, question)
    if(!Q) {
      alert('save question first')
      return // change this to create the question
    }
    let qid = Q.id
    let matchingScore = SELECT.findScore(state, qid, aid)
    let bestScore = SELECT.findBestScore(state, qid)
    if(matchingScore && matchingScore === bestScore) return

    let value = bestScore ? bestScore.value + 1 : 1

    if(matchingScore) dispatch(SCORES.updateScore(matchingScore.id, {value}))
    else {
      const id = UNIQ.randomId(4)
      const score = { id, qid, aid, value }
      dispatch(SCORES.addScore(score))
    }
  }  
}

export function addFaqt() {
  return function(dispatch, getState) {
    const state = getState()
    function getQID(text) {
      if(!text || !text.length) return null
      const question = SELECT.findQuestionByText(state, text)
      return question ? question.id : null
    }
    function getScoreValue(qid) {
      const score = SELECT.findBestScore(state, qid)
      return score ? score.value + 1 : 1
    }
    const qid = getQID(state.ui.question)
    const aid = UNIQ.randomId(4)
    const newAnswer = { id:aid, text:'' }

    dispatch(ANSWERS.addAnswer(newAnswer))
    if(qid) {
      const score = {
        id: UNIQ.randomId(4),
        qid, aid, 
        value:getScoreValue(qid)
      }      
      dispatch(SCORES.addScore(score))
    }
  }
}