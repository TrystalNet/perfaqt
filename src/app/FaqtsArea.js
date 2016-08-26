import React, { Component } from 'react';
import {COL0WIDTH} from '../constants'
import Faqt from './faqt-container'

const s2 = { paddingTop: 10, width:600 }

const containerStyle = {
  paddingLeft:COL0WIDTH,
  overflowY:'auto'
}

const FaqtsArea = ({faqts, faqtId, onSetBestFaqt, onUpdateFaqt, onActivate}) => {
  return (
    <div id='faqtsContainer' style={containerStyle}>
      <div style={s2}>
        {faqts.map(faqt => 
          <Faqt 
            key={faqt.id}
            isActive={faqt.id === faqtId} 
            {...faqt}
            onSetBest={()=>onSetBestFaqt(faqt.id)}
            onChange={text=>onUpdateFaqt(faqt.id, text)}
            onActivate={()=>onActivate(faqt.id)}
            onDeactivate={()=>onActivate(null)}
            />
        )}
      </div>
    </div>
  )
}
export default FaqtsArea
