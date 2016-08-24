import React, { Component } from 'react';
import {COL0WIDTH} from '../constants'

const styleQuestionBar = {
  backgroundColor:'#f2f2f2', 
  display:'flex', 
  paddingTop:20, paddingBottom:20, 
  borderBottom: 'lightgray 1px solid'
}
const stylePerfaqt = {
  width:COL0WIDTH,
  fontSize:35,
  textAlign: 'center',
  border:'lightgray 0px solid'
}
const styleQuestionField = {
  fontSize:18,
  paddingLeft:10,
  width:550
}
const styleKeepButton = {
  marginRight:20
}
const styleQuestionOption = {
  border: 'purple 3px solid',
  backgroundColor:'orange'
}
const styleRight = {
  flex:1,
  textAlign:'right', 
  marginRight:10
}
export default class QuestionBar extends Component {
  onQuestionChange(e) {
    this.props.onAsk(this.refs.fldQuestion.value)
  }
  onSaveQuestion(e) {
    const question = this.refs.fldQuestion.value
    if(!question || !question.length) return
    this.props.onSaveQuestion(question)
  }
  render() {
    const {question, questions} = this.props
    const listItems = questions.map((q,i) => <option key={i} style={styleQuestionOption}>{q}</option>)
    return (
      <div id='questionsContainer' style={styleQuestionBar}>
        <div id='perfaqt' style={stylePerfaqt}>per<span style={{color:'blue'}}>faq</span>t</div>          
        <datalist id='dl1' >
          {listItems}
        </datalist>
        <input key='f1' ref='fldQuestion' style={styleQuestionField} list='dl1' type='text' onChange={this.onQuestionChange.bind(this)}></input>
        <button key='btnSaveQuestion' style={styleKeepButton} onClick={this.onSaveQuestion.bind(this)}>keep</button>
        <div style={styleRight}></div>
      </div>
    );
  }
}
