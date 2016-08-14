import * as DAL from './dal'
import {loadAnswers} from './answers/answers-actions'
import {loadQuestions} from './questions/questions-actions'

export function initDatabase() {
  return function(dispatch) {
    DAL.openIt(() => {
      DAL.getAllAnswers(answers => {
        dispatch(loadAnswers(answers))
      })
      DAL.getAllQuestions(questions => {
        dispatch(loadQuestions(questions))
      })
    })
  }
}

export function readQuestion(text) {
  return function(dispatch, getState, extras) {
    DAL.readQuestion(text, function(result) { console.log('The result is ', result)  }) 
  }
}

export function editAnswer(answerId, text) {
  return function(dispatch, getState, extras) {
    DAL.updateAnswer(answerId, text, function(result) { console.log('alrighty then')  }) 
  }
}

export function saveAnswer(question, answer) {
  return function(dispatch, getState, extras) {
    DAL.saveAnswer(question, answer, function() {
      console.log('answer has been added')
    })
  }
}

// export function loadAnswers() {
//   return function(dispatch, getState, extras) {
//     // var answers = DAL.getAllAnswers()
//     //console.log(answers)
//     console.log('i want some answers')
//   }
// }