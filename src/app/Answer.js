import React, { Component } from 'react';

const styleContainerInactive = {
  display:'flex',
  paddingTop: 5,
  paddingBottom: 5,
  borderBottom: 'lightgrey 1px solid'
}

const styleInactive = {
  border: 'black 0px solid',
  flex:1  
}

const styleTextareaActive = {
  border: 'black 0px solid'
}

const Answer = ({id, text, isActive, onSetBest, onChange, onActivate, onDeactivate}) => {
  let fldText
  function onKeyDown(e) {
    if(!isActive) return
    switch(e.keyCode) {
      case 27: break
      default: return
    }
    onDeactivate()
  }
  if(!isActive) {
    const bits = text.split(/\r?\n/)
    return (
      <div style={styleContainerInactive}>
        <div style={styleInactive} onClick={onActivate}>
          {
            bits.map((bit,index) => bit ? <div key={index}>{bit}</div> : <div>&nbsp;</div>)
          }
        </div>
        <button onClick={onSetBest}>best</button>
      </div>
    )
  }
  return (
    <div>
      <textarea
        style={styleTextareaActive}
        ref={node => {fldText=node}} 
        value={text} 
        cols={65} 
        onKeyDown={onKeyDown}
        onChange={()=>onChange(fldText.value)}>
      </textarea>
      <button key='burger' onClick={onSetBest}>best</button>
    </div>
  )
}

export default Answer