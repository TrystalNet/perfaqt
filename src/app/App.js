import React, { Component } from 'react';
import {openIt, readQuestion} from '../dal'

export default class App extends Component {
  keydown(e) {
    switch(e.keyCode) {
      case 13:
        this.props.onAsk(this.refs.fldQuestion.value)
        return
    }
  }
  onQuestionChange(e) {
    this.props.onAsk(this.refs.fldQuestion.value)
  }
  onSaveAnswer(e) {
    const question = this.refs.fldQuestion.value
    const answer = this.refs.fldAnswer.value
    this.props.onSaveAnswer(question, answer)
  }
  onAnswerChange(answerId, e) {
    this.props.onEditAnswer({answerId, text:e.target.value})
  }
  render() {
    const {question, answers} = this.props
    var fldAnswers = answers.map(a => <div key={a.id}>
      <input type='text' value={a.text} onChange={this.onAnswerChange.bind(this, a.id)}></input>
    </div>)
    return (
      <div>
        <div><input key='f1' ref='fldQuestion' type='text' onChange={this.onQuestionChange.bind(this)} onKeyDown={this.keydown.bind(this)}></input></div>
        {fldAnswers}
        <div><button key='f3' onClick={this.onSaveAnswer.bind(this)}>Save Answer</button></div>
      </div>
    );
  }
}
