import React, { Component } from 'react';
import QuestionBar from './QuestionBar'
import MenuBar from './MenuBar'
import AnswersArea from './AnswersArea'

const COL0WIDTH = 130

const s1 = {padding:10 }
const s2 = {padding:10, border:'gray 1px solid', overflowY:'auto' }

const styleQuestionBar = {
  backgroundColor:'#f2f2f2', display:'flex', paddingTop:20, paddingBottom:20, borderBottom: 'lightgray 1px solid'
}
const stylePerfaqt = {
  width:COL0WIDTH,
  fontSize:35,
  textAlign: 'center',
  border:'lightgray 0px solid'
}
const styleToolbar = {
  height:40,
  borderBottom: 'lightgray 1px solid'
}

const styleQuestionField = {
  fontSize:18,
  paddingLeft:10,
  flex:1
}
const styleKeepButton = {
  marginRight:20
}

const styleQuestionOption = {
  border: 'purple 3px solid',
  backgroundColor:'orange'
}

export default class App extends Component {
  onQuestionChange(e) {
    this.props.onAsk(this.refs.fldQuestion.value)
  }
  onSaveQuestion(e) {
    const question = this.refs.fldQuestion.value
    if(!question || !question.length) return
    this.props.onSaveQuestion(question)
  }
  onSetBest(answerId, e) {
    const question = this.refs.fldQuestion.value
    if(!question || !question.length) return
    this.props.onSetBestAnswer(question, answerId)    
  }
  onAddAnswer(e) {
    const value = this.refs.fldNewAnswer.value
    if(value && value.length) {
      this.props.onAddAnswer(value)
      this.refs.fldNewAnswer.value = ''
    }
  }
  onSave(e) {
    this.props.onSave()
  }
  onLoad(e) {
    this.props.onLoad()
  }
  onUpdateAnswer(answerId, e) {
    const newValue = e.target.value
    this.props.onUpdateAnswer(answerId, newValue)
}
  render() {
    const {question, questions, answers, aid, isDirty} = this.props
    const {
      onSave, onLoad, onAddFaqt, onAsk, 
      onSaveQuestion, onSetBestAnswer, onAddAnswer, onUpdateAnswer,
      onActivate
    } = this.props
    return (
      <div id='app'>
        <QuestionBar {...{ question, questions, onAsk, onSaveQuestion }} />
        <MenuBar {...{isDirty, onSave, onLoad, onAddFaqt}}/>
        <AnswersArea {...{question, answers, aid, onSetBestAnswer, onAddAnswer, onUpdateAnswer, onActivate}} />
      </div>
    );
  }
}
