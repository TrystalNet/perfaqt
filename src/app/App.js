import React, { Component } from 'react';
import {openIt} from '../dal'

const s1 = {padding:10}

export default class App extends Component {
  keydown(e) {
    switch(e.keyCode) {
      case 13:
        this.props.onAsk(this.refs.fldQuestion.value)
        return
    }
  }
  onQuestionChange(e) {
    this.props.onQuestionChange(this.refs.fldQuestion.value)
  }
  onSaveAnswer(e) {
    const question = this.refs.fldQuestion.value
    const answer = this.refs.fldAnswer.value
    this.props.onSaveAnswer(question, answer)
  }
  onAnswerChange(answerId, e) {
    this.props.onEditAnswer({answerId, text:e.target.value})
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
  render() {
    const {question, answers} = this.props
    var fldAnswers = answers.map(a => <div key={a.id}>
      <input type='text' value={a.text} onChange={this.onAnswerChange.bind(this, a.id)}></input>
      <button onClick={this.onSetBest.bind(this, a.id)}>best</button>
    </div>)
    return (
      <div>
        <div style={s1}>
          <input key='f1' ref='fldQuestion' type='text' onChange={this.onQuestionChange.bind(this)} onKeyDown={this.keydown.bind(this)}></input>
          <button key='btnSaveQuestion' onClick={this.onSaveQuestion.bind(this)}>save</button>
        </div>
        <div style={s1}>
          {fldAnswers}
          <input ref='fldNewAnswer' type='text'></input>
          <button onClick={this.onAddAnswer.bind(this)}>add answer</button>
        </div>
        <div style={s1}><button key='f3' onClick={this.onSaveAnswer.bind(this)}>Save Answer</button></div>
      </div>
    );
  }
}
