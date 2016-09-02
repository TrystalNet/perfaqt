import React, { Component } from 'react';
import {COL0WIDTH} from '../constants'
import Faqt from './Faqt'

const s2 = { paddingTop: 10, width:600 }

const containerStyle = {
  paddingLeft:COL0WIDTH,
  overflowY:'auto'
}

const FaqtsArea = ({faqts, faqtId, onSetBestFaqt, onUpdateFaqt, onActivate}) => {
  return (
    <div id='faqtsContainer' style={containerStyle}>
      <div style={s2}>
        {faqts.map(faqt => { 
          return (  
          <Faqt 
            key={faqt.id}
            faqtId={faqt.id}
            onSetBest={()=>onSetBestFaqt(faqt.id)}
            onActivate={()=>onActivate(faqt.id)}
            onDeactivate={()=>onActivate(null)}
            />)
          }
        )}
      </div>
    </div>
  )
}
export default FaqtsArea
