import React, { Component } from 'react';
import {COL0WIDTH} from '../constants'
import Answer from './Answer'

const s2 = { paddingTop: 10, width:600 }

const containerStyle = {
  paddingLeft:COL0WIDTH,
  overflowY:'auto'
}

const AnswersArea = ({answers, aid, onSetBestAnswer, onUpdateAnswer, onActivate}) => {
  return (
    <div id='answersContainer' style={containerStyle}>
      <div style={s2}>
        {answers.map(answer => 
          <Answer 
            key={answer.id}
            isActive={answer.id === aid} 
            {...answer}
            onSetBest={()=>onSetBestAnswer(answer.id)}
            onChange={text=>onUpdateAnswer(answer.id, text)}
            onActivate={()=>onActivate(answer.id)}
            onDeactivate={()=>onActivate(null)}
            />
        )}
      </div>
    </div>
  )
}
export default AnswersArea
