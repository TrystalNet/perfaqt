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
    const {onAddFaqt} = this.props
    return (
      <div id='toolbar' style={styleToolbar}>
        <div style={styleRight}>
          <button onClick={onAddFaqt}>Add Faqt</button>
        </div>
      </div>
    );
  }
}
//           <button onClick={onLoad}>Load</button>
