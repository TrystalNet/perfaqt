import React, { Component } from 'react';
import {COL0WIDTH} from '../constants'

const s2 = {padding:10, width:600 }

const containerStyle = {
  paddingLeft:COL0WIDTH,
  overflowY:'auto'
}

export default class AnswersArea extends Component {
  onSetBest(answerId, e) {
    const question = this.props.question
    if(!question || !question.length) return
    this.props.onSetBestAnswer(question, answerId)    
  }
  onUpdateAnswer(answerId, e) {
    this.props.onUpdateAnswer(answerId, e.target.value)
  }
  render() {
    const {question, answers} = this.props
    const fldAnswers = answers.map(a => {
      return <div key={a.id}>
        <textarea value={a.text} cols={60} onChange={this.onUpdateAnswer.bind(this, a.id)}></textarea>
        <button onClick={this.onSetBest.bind(this, a.id)}>best</button>
      </div>
    })

    return (
      <div id='answersContainer' style={containerStyle}>
        <div style={s2}>{fldAnswers}</div>
      </div>
    );
  }
}
