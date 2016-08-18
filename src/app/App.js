import React, { Component } from 'react';
import {openIt} from '../dal'

const s1 = {padding:10}
const s2 = {padding:10, border: 'grey 1px solid', backgroundColor:'beige', height:400, overflowY:'auto' }

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
  onUpdateAnswer(answerId, e) {
    const newValue = e.target.value
    this.props.onUpdateAnswer(answerId, newValue)
}
  render() {
    const {question, questions, answers} = this.props
    const listItems = questions.map((q,i) => <option key={i}>{q}</option>)
   
    var fldAnswers = answers.map(a => {
      return <div key={a.id}>
        <textarea value={a.text} cols={60} onChange={this.onUpdateAnswer.bind(this, a.id)}></textarea>
        <button onClick={this.onSetBest.bind(this, a.id)}>best</button>
      </div>
    })
    return (
      <div>
        <div style={s1}>
          <datalist id='dl1'>
            {listItems}
          </datalist>
          <input key='f1' ref='fldQuestion' list='dl1' type='text' onChange={this.onQuestionChange.bind(this)}></input>
          <button key='btnSaveQuestion' onClick={this.onSaveQuestion.bind(this)}>save</button>
        </div>
        <div style={s1}>
          <div style={s2}>{fldAnswers}</div>
          <div style={s1}>
            <textarea ref='fldNewAnswer' cols={60} ></textarea>
            <button onClick={this.onAddAnswer.bind(this)}>add answer</button>
          </div>
        </div>
        <button onClick={this.onSave.bind(this)}>Save</button>
      </div>
    );
  }
}
