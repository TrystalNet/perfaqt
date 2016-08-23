import React, { Component } from 'react';
import {COL0WIDTH} from '../constants'

const styleToolbar = {
  height:40,
  borderBottom: 'lightgray 1px solid',
  paddingLeft: COL0WIDTH,
  width:600,
  display:'flex'
}

const styleLeft = {

}

const styleRight = {
  flex:1,
  textAlign:'right'
}

export default class MenuBar extends Component {
  render() {
    const {onSave, onLoad, onAddFaqt, isDirty} = this.props
    console.log('menubar:isDirty:',isDirty)
    return (
      <div id='toolbar' style={styleToolbar}>
        <div>
          {
            isDirty ? <button onClick={onSave}>Save</button> : null
          }
          <button onClick={onLoad}>Load</button>
        </div>
        <div style={styleRight}>
          <button onClick={onAddFaqt}>Add Faqt</button>
        </div>
      </div>
    );
  }
}
